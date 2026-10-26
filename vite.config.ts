import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { createGeminiMiddleware } from './server/gemini.mjs';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', 'GEMINI_');
  const middleware = createGeminiMiddleware({ apiKey: env.GEMINI_API_KEY });
  return {
    server: { port: 3000, host: '127.0.0.1', strictPort: true },
    preview: { port: 3000, host: '127.0.0.1', strictPort: true },
    plugins: [react(), {
      name: 'local-gemini-server',
      configureServer(server) { server.middlewares.use(middleware); },
      configurePreviewServer(server) { server.middlewares.use(middleware); },
    }],
    resolve: { alias: { '@': path.resolve(__dirname, '.') } },
  };
});
