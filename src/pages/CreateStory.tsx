import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StoryOptions, type StorySettings } from "@/components/StoryOptions";
import { StoryPlayer } from "@/components/StoryPlayer";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function CreateStory() {
  const [storySettings, setStorySettings] = useState<StorySettings | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleStart = (settings: StorySettings) => {
    setStorySettings(settings);
  };

  const handleBack = () => {
    setStorySettings(null);
  };

  const handleSaveStory = async (title: string, content: string, audioUrl: string, backgroundMusicUrl: string) => {
    const { error } = await supabase
      .from('stories')
      .insert({
        title,
        content,
        audio_url: audioUrl,
        background_music_url: backgroundMusicUrl,
        settings: storySettings
      });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error saving story",
        description: error.message
      });
      return;
    }

    toast({
      title: "Story saved",
      description: "Your story has been saved successfully."
    });

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50">
      <Header />
      <main className="flex-1 container py-8">
        {storySettings ? (
          <StoryPlayer 
            settings={storySettings} 
            onBack={handleBack}
            onSave={handleSaveStory}
          />
        ) : (
          <div className="max-w-7xl mx-auto">
            <StoryOptions onStart={handleStart} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}