export const GEMINI_MODEL = "gemini-pro";

export const generationConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 40,
  maxOutputTokens: 4096, // Reduced from 8192 to help with rate limits
};

export const createStoryPrompt = (settings: {
  ageGroup: string;
  duration: number;
  theme: string;
  language: string;
}) => {
  return `Create a unique and engaging ${settings.duration} minute bedtime story for children aged ${settings.ageGroup} with the theme: ${settings.theme}.
  The story should be in ${settings.language} language.
  Include elements that are:
  1. Age-appropriate and engaging for ${settings.ageGroup} year olds
  2. Related to the theme of ${settings.theme}
  3. Have a clear beginning, middle, and end
  4. Include descriptive language and dialogue
  5. Have a positive message or moral
  6. Be approximately ${settings.duration} minutes when read aloud
  
  Make sure this story is unique and different from previous ones.
  
  Format the response as a JSON object with 'title' and 'content' fields.
  Keep the response concise and focused.`;
};