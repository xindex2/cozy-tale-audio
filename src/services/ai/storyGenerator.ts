import { openaiClient } from "../apis/openai/openaiClient";
import type { StoryGenerationSettings, StoryResponse } from "./types";
import { toast } from "@/hooks/use-toast";

export async function generateStory(settings: StoryGenerationSettings): Promise<StoryResponse> {
  try {
    console.log("Starting story generation with settings:", settings);
    
    const systemPrompt = `You are a professional storyteller who writes ONLY in ${settings.language}. 
    Important rules:
    1. Write EVERYTHING in ${settings.language} only, including numbers and measurements
    2. Use proper grammar, punctuation, and formatting for ${settings.language}
    3. Never mix languages or include any English text
    4. Ensure the story flows naturally with appropriate sentence structure
    5. Include proper punctuation marks according to ${settings.language} rules
    6. ALWAYS format your response exactly like this, with these exact English labels followed by the content in the target language:
       TITLE: [Story Title in ${settings.language}]
       CONTENT: [Story Content in ${settings.language}]`;
    
    const userPrompt = `Create an engaging story with these specifications:
    - Duration: ${settings.duration} minutes
    - Age group: ${settings.ageGroup}
    - Theme: ${settings.theme}
    
    Requirements:
    1. Write a complete, coherent story
    2. Use age-appropriate language and themes
    3. Include proper dialogue and descriptions
    4. Maintain consistent narrative flow
    5. Use appropriate punctuation and grammar`;

    let title = '';
    let content = '';
    let buffer = '';

    const response = await openaiClient.generateContent(
      userPrompt, 
      systemPrompt,
      (chunk) => {
        buffer += chunk;
        
        // Try to extract title and content from the buffer
        const titleMatch = buffer.match(/TITLE:\s*(.*?)(?=\s*\n+\s*CONTENT:)/s);
        const contentMatch = buffer.match(/CONTENT:\s*([\s\S]*$)/s);
        
        if (titleMatch && !title) {
          title = titleMatch[1].trim();
          console.log("Title extracted:", title);
        }
        
        if (contentMatch) {
          content = contentMatch[1].trim();
        }
      }
    );

    console.log("Story generation completed");

    // Only proceed with audio generation if audio is enabled
    if (settings.audio) {
      toast({
        title: "Generating Audio",
        description: "Please wait while we create the audio narration...",
      });

      // Generate audio using OpenAI TTS
      const audioUrl = await openaiClient.generateSpeech(content, settings.voice || 'alloy');
      console.log("Audio generated successfully:", audioUrl);

      toast({
        title: "Audio Ready",
        description: "Your story's audio narration is ready to play!",
      });

      return {
        title,
        content,
        audioUrl,
        backgroundMusicUrl: settings.music ? `/assets/${settings.music}.mp3` : null
      };
    }

    // Return without audio if audio is disabled
    return {
      title,
      content,
      audioUrl: null,
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
}