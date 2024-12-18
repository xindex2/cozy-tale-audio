export const OPENAI_CONFIG = {
  defaultModel: 'gpt-4o-mini',
  baseUrl: 'https://api.openai.com/v1',
  defaultHeaders: {
    'Content-Type': 'application/json',
  },
  generationConfig: {
    temperature: 0.7,
    stream: true,
  }
};