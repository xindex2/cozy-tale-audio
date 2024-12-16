import { openaiClient } from "./openaiClient";
import type { StoryGenerationSettings, StoryResponse } from "./types";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const openaiService = {
  async generateStory(settings: StoryGenerationSettings): Promise<StoryResponse> {
    try {
      console.log("Starting story generation with settings:", settings);
      
      // Create a language-specific system prompt
      const systemPrompt = `You are a storyteller who writes ONLY in ${settings.language}. 
      DO NOT include ANY text in other languages. 
      All numbers, measurements, and descriptions MUST be in ${settings.language}.`;
      
      const userPrompt = `Write a complete story with these characteristics (remember to write EVERYTHING in ${settings.language} ONLY):
      - Duration: ${settings.duration}
      - Age group: ${settings.ageGroup}
      - Theme: ${settings.theme}
      
      The story should:
      1. Be engaging and age-appropriate
      2. Have a clear beginning, middle, and end
      3. Include descriptive language and dialogue
      4. Have a positive message or moral
      5. Be unique and different from previous stories
      
      Format the response exactly like this:
      TITLE: Your Story Title Here

      CONTENT: Your story content here...`;

      const response = await openaiClient.generateContent(userPrompt, systemPrompt);
      console.log("Raw OpenAI response:", response);
      
      const titleMatch = response.match(/TITLE:\s*(.*?)(?=\s*\n\s*CONTENT:)/s);
      const contentMatch = response.match(/CONTENT:\s*([\s\S]*$)/s);
      
      if (!titleMatch || !contentMatch) {
        console.error("Failed to parse story format. Response:", response);
        throw new Error("Failed to parse story format");
      }

      const title = titleMatch[1].trim();
      const content = contentMatch[1].trim();

      console.log("Parsed story:", { title, content });

      // Get the ElevenLabs API key
      const { data: apiKeyData, error: apiKeyError } = await supabase
        .from('api_keys')
        .select('key_value')
        .eq('key_name', 'ELEVEN_LABS_API_KEY')
        .eq('is_active', true)
        .single();

      if (apiKeyError || !apiKeyData) {
        console.error("Error fetching ElevenLabs API key:", apiKeyError);
        throw new Error("ElevenLabs API key not found");
      }

      // Generate audio using ElevenLabs with the correct language model
      const voiceId = settings.voice || "21m00Tcm4TlvDq8ikWAM"; // Default voice ID
      const audioResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': apiKeyData.key_value
        },
        body: JSON.stringify({
          text: content,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5
          }
        })
      });

      if (!audioResponse.ok) {
        throw new Error(`ElevenLabs API error: ${audioResponse.statusText}`);
      }

      const audioBlob = await audioResponse.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      console.log("Audio generated successfully:", audioUrl);

      // Get background music URL and ensure it's a full URL
      const backgroundMusicUrl = settings.music ? `/assets/${settings.music}.mp3` : null;
      
      return {
        title,
        content,
        audioUrl,
        backgroundMusicUrl
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

  async generateContent(prompt: string, storyContext?: string): Promise<string> {
    try {
      const fullPrompt = storyContext 
        ? `Based on this story: "${storyContext}"\n\n${prompt}`
        : prompt;
        
      const response = await openaiClient.generateContent(fullPrompt);
      return response;
    } catch (error) {
      console.error("Error generating content:", error);
      throw error;
    }
  }
};