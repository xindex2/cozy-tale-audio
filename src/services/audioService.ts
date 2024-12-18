import { supabase } from "@/integrations/supabase/client";
import { chunkText } from "@/utils/textChunker";

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
      .eq('key_name', 'OPENAI_API_KEY')
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

      // Split text into chunks that fit within OpenAI's limit
      const chunks = chunkText(text);
      const audioBlobs: Blob[] = [];

      // Generate audio for each chunk
      for (const chunk of chunks) {
        const response = await fetch('https://api.openai.com/v1/audio/speech', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: "tts-1",
            voice: "alloy",
            input: chunk,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          console.error("OpenAI API error:", error);
          throw new Error('Failed to generate audio');
        }

        const audioBlob = await response.blob();
        audioBlobs.push(audioBlob);
      }

      // Combine all audio blobs
      const combinedBlob = new Blob(audioBlobs, { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(combinedBlob);
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