import { supabase } from "@/integrations/supabase/client";
import type { StorySettings } from "@/components/StoryOptions";
import type { Json } from "@/integrations/supabase/types";

interface SaveStoryParams {
  userId: string;
  title: string;
  content: string;
  audioUrl: string;
  backgroundMusicUrl: string;
  settings: StorySettings;
}

// Helper function to convert StorySettings to Json type
function convertSettingsToJson(settings: StorySettings): Json {
  return settings as unknown as Json;
}

export async function saveStory({
  userId,
  title,
  content,
  audioUrl,
  backgroundMusicUrl,
  settings,
}: SaveStoryParams) {
  console.log("Saving story for user:", userId);
  
  try {
    const { data, error } = await supabase
      .from("stories")
      .insert({
        user_id: userId,
        title,
        content,
        audio_url: audioUrl,
        background_music_url: backgroundMusicUrl,
        settings: convertSettingsToJson(settings),
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving story:", error);
      throw new Error(`Failed to save story: ${error.message}`);
    }

    console.log("Story saved successfully:", data);
    return data;
  } catch (error) {
    console.error("Error in saveStory:", error);
    throw error;
  }
}

export async function getUserStories(userId: string) {
  console.log("Fetching stories for user:", userId);
  
  try {
    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching stories:", error);
      throw new Error(`Failed to fetch stories: ${error.message}`);
    }

    console.log("Stories fetched successfully:", data);
    return data;
  } catch (error) {
    console.error("Error in getUserStories:", error);
    throw error;
  }
}