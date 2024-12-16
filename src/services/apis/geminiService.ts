import { generateStory } from "./gemini/storyGenerator";
import type { StoryGenerationSettings } from "./gemini/types";
import { geminiClient } from "./gemini/geminiClient";

class GeminiService {
  async generateStory(settings: StoryGenerationSettings) {
    return generateStory(settings);
  }

  async generateResponse(message: string, language: string = 'en') {
    try {
      const prompt = `As a helpful assistant for children's stories, respond to this message: ${message}`;
      return await geminiClient.generateContent(prompt);
    } catch (error) {
      console.error("Error generating response:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();