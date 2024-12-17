import { supabase } from "@/integrations/supabase/client";

const AUDIO_URLS = {
  "gentle-lullaby": "https://cdn.pixabay.com/download/audio/2023/09/05/audio_168a3e0caa.mp3",
  "peaceful-dreams": "https://cdn.pixabay.com/download/audio/2023/05/16/audio_166b9c7242.mp3",
  "ocean-waves": "https://cdn.pixabay.com/download/audio/2022/02/23/audio_ea70ad08e3.mp3",
  "soft-piano": "https://cdn.pixabay.com/download/audio/2024/11/04/audio_4956b4edd1.mp3",
  "nature-sounds": "https://cdn.pixabay.com/download/audio/2024/09/10/audio_6e5d7d1912.mp3"
};

class AudioService {
  private elevenLabsKey: string | null = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('key_value')
        .eq('key_name', 'ELEVEN_LABS_API_KEY')
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching ElevenLabs API key:', error);
        throw new Error('Failed to fetch ElevenLabs API key');
      }

      if (!data?.key_value) {
        throw new Error('No active ElevenLabs API key found');
      }

      this.elevenLabsKey = data.key_value;
      this.isInitialized = true;
      console.log("Audio service initialized successfully");
    } catch (error) {
      console.error("Error initializing audio service:", error);
      throw error;
    }
  }

  getBackgroundMusicUrl(musicType: string): string | null {
    return AUDIO_URLS[musicType as keyof typeof AUDIO_URLS] || null;
  }

  async generateSpeech(text: string, voice: string = 'alloy'): Promise<string> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      console.log("Generating speech for text:", text.substring(0, 100) + "...");
      
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.elevenLabsKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: text,
          voice: voice,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("OpenAI TTS API error:", error);
        throw new Error(error.error?.message || 'Failed to generate speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      console.log("Speech generated successfully");
      return audioUrl;
    } catch (error: any) {
      console.error("Error generating speech:", error);
      throw error;
    }
  }
}

export const audioService = new AudioService();