import { generateStory } from "./openai/storyGenerator";
import type { StoryGenerationSettings } from "./gemini/types";
import { openaiClient } from "./openai/openaiClient";

class GeminiService {
  async generateStory(settings: StoryGenerationSettings) {
    return generateStory(settings);
  }

  async generateResponse(message: string, language: string = 'en') {
    try {
      const prompt = `As a helpful assistant for children's stories, respond to this message: ${message}`;
      return await openaiClient.generateContent(prompt);
    } catch (error) {
      console.error("Error generating response:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();