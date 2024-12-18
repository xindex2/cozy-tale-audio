import { supabase } from "@/integrations/supabase/client";
import { chunkText } from "@/utils/textChunker";
import { toast } from "@/hooks/use-toast";

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
  async generateAudio(text: string, voice: string = 'alloy'): Promise<string> {
    try {
      console.log("Starting audio generation for text length:", text.length);
      const apiKey = await getOpenAIKey();

      // Split text into chunks that fit within OpenAI's limit
      const chunks = chunkText(text, 3000);
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
            voice: voice,
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
      
      // Upload to Supabase storage
      const fileName = `story-audio-${Date.now()}.mp3`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('story-audio')
        .upload(fileName, combinedBlob);

      if (uploadError) {
        throw new Error(`Failed to upload audio: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('story-audio')
        .getPublicUrl(fileName);

      console.log("Audio generation and upload completed successfully");
      return publicUrl;
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

  async getBackgroundMusicUrl(musicId: string): Promise<string | null> {
    if (!musicId || musicId === 'no-music') return null;

    try {
      const { data, error } = await supabase
        .from('music_library')
        .select('url')
        .eq('id', musicId)
        .single();

      if (error) throw error;
      return data?.url || null;
    } catch (error) {
      console.error('Error fetching music URL:', error);
      return null;
    }
  }
};