import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI | null = null;

export const initializeGemini = (apiKey: string) => {
  genAI = new GoogleGenerativeAI(apiKey);
};

export const generateStoryWithGemini = async (
  prompt: string,
  language: string = 'en'
): Promise<{ title: string; content: string }> => {
  if (!genAI) {
    throw new Error("Gemini API not initialized");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const systemPrompt = `You are a creative storyteller specializing in children's bedtime stories. 
    Create a story that is engaging, age-appropriate, and promotes positive values.
    The story should be in ${language} language.
    Format the response as a JSON object with 'title' and 'content' fields.`;

  const fullPrompt = `${systemPrompt}\n\nStory prompt: ${prompt}`;

  try {
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const parsed = JSON.parse(text);
      return {
        title: parsed.title || "Bedtime Story",
        content: parsed.content || text
      };
    } catch {
      // If JSON parsing fails, return the raw text
      return {
        title: "Bedtime Story",
        content: text
      };
    }
  } catch (error) {
    console.error("Error generating story with Gemini:", error);
    throw error;
  }
};