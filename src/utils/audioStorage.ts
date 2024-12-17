import { supabase } from "@/integrations/supabase/client";

export async function uploadAudioToStorage(audioBlob: Blob, fileName: string): Promise<string | null> {
  try {
    const filePath = `${crypto.randomUUID()}-${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('story-audio')
      .upload(filePath, audioBlob, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error) {
      console.error('Error uploading audio:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('story-audio')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error in uploadAudioToStorage:', error);
    return null;
  }
}