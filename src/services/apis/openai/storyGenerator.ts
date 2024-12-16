import { openaiClient } from "./openaiClient";
import type { StoryGenerationSettings, StoryResponse } from "./types";
import { toast } from "@/hooks/use-toast";

export const openaiService = {
  async generateStory(settings: StoryGenerationSettings): Promise<StoryResponse> {
    try {
      const prompt = `Create a unique and engaging ${settings.duration} minute bedtime story for children aged ${settings.ageGroup} with the theme: ${settings.theme}.
      The story should be in ${settings.language} language.
      Include elements that are:
      1. Age-appropriate and engaging for ${settings.ageGroup} year olds
      2. Related to the theme of ${settings.theme}
      3. Have a clear beginning, middle, and end
      4. Include descriptive language and dialogue
      5. Have a positive message or moral
      6. Be approximately ${settings.duration} minutes when read aloud
      
      Make sure this story is unique and different from previous ones.
      
      Format the response exactly like this:
      TITLE: Your Story Title Here
      
      CONTENT: Your story content here...`;

      const response = await openaiClient.generateContent(prompt);
      
      // Parse the response to extract title and content
      const titleMatch = response.match(/TITLE:\s*(.*?)(?=\n\n)/s);
      const contentMatch = response.match(/CONTENT:\s*([\s\S]*$)/);
      
      if (!titleMatch || !contentMatch) {
        throw new Error("Failed to parse story format");
      }

      const title = titleMatch[1].trim();
      const content = contentMatch[1].trim();
      
      return {
        title,
        content,
        backgroundMusicUrl: settings.music ? `/assets/${settings.music}.mp3` : null
      };
    } catch (error) {
      console.error("Error generating story:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate story",
        variant: "destructive",
      });
      throw error;
    }
  },

  async generateContent(prompt: string, language: string = 'en'): Promise<string> {
    try {
      return await openaiClient.generateContent(prompt);
    } catch (error) {
      console.error("Error generating content:", error);
      throw error;
    }
  }
};