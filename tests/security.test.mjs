import { test } from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import fs from 'node:fs';
import { createGeminiMiddleware } from '../server/gemini.mjs';

const body = { action: 'post', topic: 'test', audience: 'student', tone: 'casual' };
async function request(handler, overrides = {}) {
  const req = Readable.from([overrides.raw ?? JSON.stringify(overrides.body ?? body)]);
  Object.assign(req, { method: 'POST', url: '/api/gemini', socket: { remoteAddress: '127.0.0.1' } }, overrides);
  req.headers = { host: '127.0.0.1:3000', origin: 'http://127.0.0.1:3000', 'content-type': 'application/json', ...overrides.headers };
  const res = { statusCode: 200, setHeader() {}, end(data) { this.body = JSON.parse(data); } };
  await handler(req, res, () => { res.next = true; });
  return res;
}

test('forwards fixed options without disclosing the server key', async () => {
  let providerBody;
  const res = await request(createGeminiMiddleware({ apiKey: 'synthetic-secret', generate: async (data, key) => { providerBody = data; assert.equal(key, 'synthetic-secret'); return 'test result'; } }));
  assert.deepEqual(res.body, { text: 'test result' });
  assert.equal(providerBody.generationConfig.maxOutputTokens, 1024);
  assert.ok(!JSON.stringify(res.body).includes('synthetic-secret'));
});
for (const overrides of [
  { socket: { remoteAddress: '192.0.2.1' } },
  { headers: { host: 'attacker.example:3000' } },
  { headers: { origin: 'https://attacker.example' } },
  { headers: { 'sec-fetch-site': 'cross-site' } },
]) test(`rejects cross-origin or remote request ${JSON.stringify(overrides)}`, async () => {
  const res = await request(createGeminiMiddleware({ apiKey: 'synthetic-secret', generate: () => assert.fail('must not call provider') }), overrides);
  assert.equal(res.statusCode, 403);
});
test('fails closed when no server key is configured', async () => assert.equal((await request(createGeminiMiddleware())).statusCode, 503));
test('rejects malformed, oversized, and unsupported requests', async () => {
  const handler = createGeminiMiddleware({ apiKey: 'synthetic-secret', generate: () => assert.fail('must not call provider') });
  assert.equal((await request(handler, { raw: '{' })).statusCode, 400);
  assert.equal((await request(handler, { body: { action: 'arbitrary-model' } })).statusCode, 400);
  assert.equal((await request(handler, { raw: 'x'.repeat(16385) })).statusCode, 413);
});
test('rejects simple cross-origin content types and GET', async () => {
  const handler = createGeminiMiddleware({ apiKey: 'synthetic-secret' });
  assert.equal((await request(handler, { headers: { 'content-type': 'text/plain' } })).statusCode, 415);
  assert.equal((await request(handler, { method: 'GET' })).statusCode, 405);
});
test('does not return provider error details', async () => {
  const handler = createGeminiMiddleware({ apiKey: 'synthetic-secret', generate: async () => { throw new Error('synthetic-secret'); } });
  const res = await request(handler);
  assert.equal(res.statusCode, 502);
  assert.ok(!JSON.stringify(res.body).includes('synthetic-secret'));
});
test('rate limits before contacting the provider', async () => {
  const handler = createGeminiMiddleware({ apiKey: 'synthetic-secret', generate: async () => 'ok' });
  for (let i = 0; i < 10; i++) assert.equal((await request(handler)).statusCode, 200);
  assert.equal((await request(handler)).statusCode, 429);
});
test('returns structured voice results', async () => {
  const handler = createGeminiMiddleware({ apiKey: 'synthetic-secret', generate: async () => JSON.stringify({ type: 'unknown', message: 'test' }) });
  const res = await request(handler, { body: { action: 'voice', transcript: 'test' } });
  assert.deepEqual(res.body, { type: 'unknown', message: 'test' });
});
test('limits concurrent provider calls even when bodies arrive together', async () => {
  let release;
  const pending = new Promise(resolve => { release = resolve; });
  const handler = createGeminiMiddleware({ apiKey: 'synthetic-secret', generate: () => pending });
  const first = request(handler);
  const second = request(handler);
  await new Promise(resolve => setImmediate(resolve));
  const third = await request(handler);
  assert.equal(third.statusCode, 429);
  release('ok');
  await Promise.all([first, second]);
});
test('frontend and Vite config do not inject provider credentials', () => {
  const client = fs.readFileSync(new URL('../services/geminiService.ts', import.meta.url), 'utf8');
  const config = fs.readFileSync(new URL('../vite.config.ts', import.meta.url), 'utf8');
  assert.doesNotMatch(client, /process\.env|GoogleGenAI|@google\/genai/);
  assert.doesNotMatch(config, /define\s*:|process\.env\.API_KEY|host:\s*['"]0\.0\.0\.0/);
});
