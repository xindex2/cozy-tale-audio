export const OPENAI_CONFIG = {
  baseUrl: 'https://api.openai.com/v1',
  defaultModel: 'gpt-4o-mini',
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
  generationConfig: {
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    stream: true,
  },
  timeoutMs: 30000, // 30 second timeout
};