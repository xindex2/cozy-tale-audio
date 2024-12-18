import { supabase } from "@/integrations/supabase/client";
import { chunkText } from "@/utils/textChunker";
import { toast } from "@/hooks/use-toast";

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

    if (error) {
      console.error('Error fetching OpenAI API key:', error);
      throw new Error('Failed to fetch OpenAI API key');
    }
    
    if (!data?.key_value) {
      throw new Error('OpenAI API key not found or inactive');
    }
    
    return data.key_value;
  } catch (error) {
    console.error('Error in getOpenAIKey:', error);
    toast({
      title: "Error",
      description: "Failed to access OpenAI API key. Please check your configuration.",
      variant: "destructive",
    });
    throw error;
  }
}

export const audioService = {
  async generateAudio(text: string): Promise<string> {
    try {
      console.log("Starting audio generation for text length:", text.length);
      const apiKey = await getOpenAIKey();

      // Split text into chunks that fit within OpenAI's limit
      const chunks = chunkText(text, 3000); // Using 3000 to be safe
      console.log(`Split text into ${chunks.length} chunks`);
      
      const audioBlobs: Blob[] = [];

      // Generate audio for each chunk
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        console.log(`Processing chunk ${i + 1}/${chunks.length}, length: ${chunk.length}`);

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
          throw new Error(`Failed to generate audio for chunk ${i + 1}: ${error.error?.message || 'Unknown error'}`);
        }

        const audioBlob = await response.blob();
        audioBlobs.push(audioBlob);
        console.log(`Successfully generated audio for chunk ${i + 1}`);
      }

      // Combine all audio blobs
      console.log("Combining audio chunks...");
      const combinedBlob = new Blob(audioBlobs, { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(combinedBlob);
      console.log("Audio generation completed successfully");
      return audioUrl;
    } catch (error) {
      console.error('Error generating audio:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate audio",
        variant: "destructive",
      });
      throw error;
    }
  },

  getBackgroundMusicUrl(musicSetting: string | null): string | null {
    if (!musicSetting || musicSetting === 'no-music') return null;
    return AUDIO_URLS[musicSetting as keyof typeof AUDIO_URLS] || null;
  }
};