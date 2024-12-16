import { openaiClient } from "./openaiClient";
import type { StoryGenerationSettings, StoryResponse } from "../gemini/types";
import { toast } from "@/hooks/use-toast";

export async function generateStory(settings: StoryGenerationSettings): Promise<StoryResponse> {
  try {
    const prompt = `Create a unique and engaging ${settings.duration} minute bedtime story for children aged ${settings.ageGroup} with the theme: ${settings.theme}.
    The story should be in ${settings.language} language.
    Include elements that are:
    1. Age-appropriate and engaging for ${settings.ageGroup} year olds
    2. Related to the theme of ${settings.theme}
    3. Have a clear beginning, middle, and end
    4. Include descriptive language and dialogue
    5. Have a positive message or moral
    6. Be approximately ${settings.duration} minutes when read aloud`;

    const response = await openaiClient.generateContent(prompt);
    
    // Extract title from first line and content from rest
    const lines = response.split('\n');
    const title = lines[0].replace(/^(Title:|\#|\*)/gi, '').trim();
    const content = lines.slice(1).join('\n').trim();
    
    return {
      title,
      content
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
}