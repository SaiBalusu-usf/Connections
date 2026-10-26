// Credentials exist only in the local server environment.
async function requestAI(action: string, input: Record<string, string>) {
  const response = await fetch('/api/gemini', {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...input }),
  });
  if (!response.ok) throw new Error('AI service is unavailable');
  return response.json();
}

export const generateLinkedInPost = async (
  topic: string, audience: 'student' | 'professional', tone: 'casual' | 'professional' | 'excited'
): Promise<string> => {
  try { return (await requestAI('post', { topic, audience, tone })).text; }
  catch { return 'AI service is unavailable. Check the local server configuration.'; }
};

export const parseVoiceCommand = async (transcript: string): Promise<any> => {
  try { return await requestAI('voice', { transcript }); }
  catch { return { type: 'unknown', message: 'AI service is unavailable. Check the local server configuration.' }; }
};
