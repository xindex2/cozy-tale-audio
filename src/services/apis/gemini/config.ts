import { GenerationConfig } from "@google/generative-ai";

export const GEMINI_MODEL = "gemini-pro";

export const generationConfig: GenerationConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 1,
  maxOutputTokens: 2048,
};

export const createStoryPrompt = (settings: {
  ageGroup: string;
  duration: number;
  theme: string;
  language: string;
}) => `Create a unique and engaging ${settings.duration} minute bedtime story for children aged ${settings.ageGroup} with the theme: ${settings.theme}.
The story should be in ${settings.language} language.
Include elements that are:
1. Age-appropriate and engaging for ${settings.ageGroup} year olds
2. Related to the theme of ${settings.theme}
3. Have a clear beginning, middle, and end
4. Include descriptive language and dialogue
5. Have a positive message or moral
6. Be approximately ${settings.duration} minutes when read aloud

Format the response as a JSON object with 'title' and 'content' fields.`;