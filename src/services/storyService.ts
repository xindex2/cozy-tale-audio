import { supabase } from "@/integrations/supabase/client";
import type { StorySettings } from "@/components/StoryOptions";
import { useToast } from "@/hooks/use-toast";

export async function saveStory({
  userId,
  title,
  content,
  audioUrl,
  backgroundMusicUrl,
  settings
}: {
  userId: string;
  title: string;
  content: string;
  audioUrl: string;
  backgroundMusicUrl: string;
  settings: StorySettings;
}) {
  console.log("Saving story for user:", userId);
  
  const { error } = await supabase
    .from('stories')
    .insert({
      title,
      content,
      audio_url: audioUrl,
      background_music_url: backgroundMusicUrl,
      settings: JSON.stringify(settings),
      user_id: userId
    });

  if (error) {
    console.error("Error saving story:", error);
    throw error;
  }

  console.log("Story saved successfully");
}