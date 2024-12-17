import { supabase } from "@/integrations/supabase/client";

const AUDIO_URLS = {
  "sleeping-lullaby": "https://cdn.pixabay.com/download/audio/2023/05/16/audio_166b9c7242.mp3",
  "water-dreams": "https://cdn.pixabay.com/download/audio/2022/02/23/audio_ea70ad08e3.mp3",
  "forest-birds": "https://cdn.pixabay.com/download/audio/2022/02/12/audio_8ca49a7f20.mp3",
  "relaxing-piano": "https://cdn.pixabay.com/download/audio/2024/11/04/audio_4956b4edd1.mp3",
  "gentle-lullaby": "https://cdn.pixabay.com/download/audio/2023/09/05/audio_168a3e0caa.mp3"
};

async function getOpenAIKey() {
  const { data, error } = await supabase
    .from('api_keys')
    .select('key_value')
    .eq('key_name', 'OPENAI_API_KEY')
    .eq('is_active', true)
    .single();

  if (error || !data) {
    console.error("Error fetching OpenAI API key:", error);
    throw new Error('OpenAI API key not found or not active');
  }

  return data.key_value;
}

export const audioService = {
  async generateAudio(text: string): Promise<string> {
    try {
      const apiKey = await getOpenAIKey();
      
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: text,
          voice: 'alloy',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      const audioBlob = await response.blob();
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.error("Error generating audio:", error);
      throw error;
    }
  },

  getBackgroundMusicUrl(musicSetting: string): string | null {
    return musicSetting && musicSetting !== 'no-music' ? AUDIO_URLS[musicSetting] || null : null;
  }
};