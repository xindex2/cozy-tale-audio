import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StoryOptions, type StorySettings } from "@/components/StoryOptions";
import { StoryPlayer } from "@/components/StoryPlayer";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function CreateStory() {
  const [storySettings, setStorySettings] = useState<StorySettings | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please log in to create stories",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }
      setUserId(session.user.id);
    };

    checkAuth();
  }, [navigate, toast]);

  const handleStart = (settings: StorySettings) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please log in to create stories",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }
    setStorySettings(settings);
  };

  const handleBack = () => {
    setStorySettings(null);
  };

  const handleSaveStory = async (title: string, content: string, audioUrl: string, backgroundMusicUrl: string) => {
    if (!userId) {
      toast({
        title: "Authentication required",
        description: "Please log in to save stories",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('stories')
      .insert({
        title,
        content,
        audio_url: audioUrl,
        background_music_url: backgroundMusicUrl,
        settings: JSON.stringify(storySettings),
        user_id: userId // Add the user_id to satisfy RLS policy
      });

    if (error) {
      console.error("Error saving story:", error);
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

  // Don't render anything until we've checked authentication
  if (userId === null) {
    return null;
  }

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