import { supabase } from "@/integrations/supabase/client";

export async function uploadAudioToStorage(audioBlob: Blob, fileName: string): Promise<string | null> {
  try {
    console.log("Starting audio upload for:", fileName);
    
    // Generate a unique file path with timestamp
    const timestamp = Date.now();
    const filePath = `${timestamp}-${fileName}`;
    
    // Upload the audio file to the story-audio bucket
    const { data, error } = await supabase.storage
      .from('story-audio')
      .upload(filePath, audioBlob, {
        cacheControl: '3600',
        upsert: false,
        contentType: 'audio/mpeg'
      });

    if (error) {
      console.error('Error uploading audio:', error);
      return null;
    }

    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('story-audio')
      .getPublicUrl(filePath);

    console.log("Audio uploaded successfully, public URL:", publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Error in uploadAudioToStorage:', error);
    return null;
  }
}