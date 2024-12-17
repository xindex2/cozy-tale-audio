import { supabase } from "@/integrations/supabase/client";

const AUDIO_URLS = {
  "no-music": null,
  "sleeping-lullaby": "/assets/gentle-lullaby.mp3",
  "water-dreams": "/assets/ocean-waves.mp3",
  "forest-birds": "/assets/nature-sounds.mp3",
  "relaxing-piano": "/assets/soft-piano.mp3",
  "gentle-dreams": "/assets/peaceful-dreams.mp3"
};

async function getOpenAIKey() {
  try {
    const { data, error } = await supabase
      .from('api_keys')
      .select('key_value')
      .eq('api_type', 'openai')
      .eq('is_active', true)
      .single();

    if (error) throw error;
    return data?.key_value;
  } catch (error) {
    console.error('Error fetching OpenAI API key:', error);
    throw new Error('Failed to fetch OpenAI API key');
  }
}

export const audioService = {
  async generateAudio(text: string): Promise<string> {
    try {
      const apiKey = await getOpenAIKey();
      if (!apiKey) {
        throw new Error('OpenAI API key not found');
      }

      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: "tts-1",
          voice: "alloy",
          input: text,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      return audioUrl;
    } catch (error) {
      console.error('Error generating audio:', error);
      throw error;
    }
  },

  getBackgroundMusicUrl(musicSetting: string | null): string | null {
    if (!musicSetting || musicSetting === 'no-music') return null;
    return AUDIO_URLS[musicSetting as keyof typeof AUDIO_URLS] || null;
  }
};