import { openaiClient } from "./openaiClient";
import type { StoryGenerationSettings, StoryResponse } from "./types";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const openaiService = {
  async generateStory(settings: StoryGenerationSettings): Promise<StoryResponse> {
    try {
      console.log("Starting story generation...");
      
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
      
      Format the response exactly like this, including the exact strings "TITLE:" and "CONTENT:" (no extra spaces or characters):
      TITLE: Your Story Title Here

      CONTENT: Your story content here...`;

      const response = await openaiClient.generateContent(prompt);
      console.log("Raw OpenAI response:", response);
      
      // Parse the response to extract title and content
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

      // Generate audio using ElevenLabs
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
      
      return {
        title,
        content,
        audioUrl,
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

  async generateContent(prompt: string): Promise<string> {
    try {
      const response = await openaiClient.generateContent(prompt);
      return response;
    } catch (error) {
      console.error("Error generating content:", error);
      throw error;
    }
  }
};