import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;

export const initializeGemini = (apiKey: string) => {
  genAI = new GoogleGenerativeAI(apiKey);
};

export const generateStoryWithGemini = async (
  settings: {
    ageGroup: string;
    duration: number;
    theme: string;
    language: string;
  }
): Promise<{ title: string; content: string }> => {
  if (!genAI) {
    throw new Error("Gemini API not initialized");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Create a unique and engaging ${settings.duration} minute bedtime story for children aged ${settings.ageGroup} with the theme: ${settings.theme}.
  The story should be in ${settings.language} language.
  Include elements that are:
  1. Age-appropriate and engaging for ${settings.ageGroup} year olds
  2. Related to the theme of ${settings.theme}
  3. Have a clear beginning, middle, and end
  4. Include descriptive language and dialogue
  5. Have a positive message or moral
  6. Be approximately ${settings.duration} minutes when read aloud
  
  Make sure this story is unique and different from previous ones. Do not use common character names like "Luna".
  
  Format the response as a JSON object with 'title' and 'content' fields.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const parsed = JSON.parse(text);
      return {
        title: parsed.title || "Bedtime Story",
        content: parsed.content || text
      };
    } catch {
      // If JSON parsing fails, create a structured response from the raw text
      const lines = text.split('\n');
      const title = lines[0].replace(/^(Title:|#|\*)/gi, '').trim();
      const content = lines.slice(1).join('\n').trim();
      
      return {
        title: title || "Bedtime Story",
        content: content || text
      };
    }
  } catch (error) {
    console.error("Error generating story with Gemini:", error);
    throw error;
  }
};