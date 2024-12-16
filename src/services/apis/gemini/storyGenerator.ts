import { geminiClient } from "./geminiClient";
import { createStoryPrompt } from "./config";
import type { StoryGenerationSettings, StoryResponse } from "./types";
import { toast } from "@/hooks/use-toast";

export async function generateStory(settings: StoryGenerationSettings): Promise<StoryResponse> {
  try {
    const prompt = createStoryPrompt(settings);
    const response = await geminiClient.generateContent(prompt);
    
    try {
      const parsed = JSON.parse(response);
      return {
        title: parsed.title || "Bedtime Story",
        content: parsed.content
      };
    } catch (parseError) {
      console.error("Error parsing story JSON:", parseError);
      const lines = response.split('\n');
      const title = lines[0].replace(/^(Title:|\#|\*)/gi, '').trim();
      const content = lines.slice(1).join('\n').trim();
      
      return {
        title: title || "Bedtime Story",
        content
      };
    }
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