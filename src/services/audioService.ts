import { supabase } from "@/integrations/supabase/client";

const AUDIO_URLS = {
  "sleeping-lullaby": "/assets/gentle-lullaby.mp3",
  "water-dreams": "/assets/ocean-waves.mp3",
  "forest-birds": "/assets/nature-sounds.mp3",
  "relaxing-piano": "/assets/soft-piano.mp3",
  "gentle-dreams": "/assets/peaceful-dreams.mp3"
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
    return musicSetting && musicSetting !== 'no-music' ? AUDIO_URLS[musicSetting as keyof typeof AUDIO_URLS] || null : null;
  }
};