import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StoryOptions, type StorySettings } from "@/components/StoryOptions";
import { StoryPlayer } from "@/components/StoryPlayer";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { saveStory } from "@/services/storyService";

export default function CreateStory() {
  const [storySettings, setStorySettings] = useState<StorySettings | null>(null);
  const { userId, isLoading } = useAuthCheck();
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const handleSaveStory = async (
    title: string, 
    content: string, 
    audioUrl: string, 
    backgroundMusicUrl: string
  ) => {
    if (!userId || !storySettings) {
      toast({
        title: "Authentication required",
        description: "Please log in to save stories",
        variant: "destructive",
      });
      return;
    }

    try {
      await saveStory({
        userId,
        title,
        content,
        audioUrl,
        backgroundMusicUrl,
        settings: storySettings
      });

      toast({
        title: "Story saved",
        description: "Your story has been saved successfully."
      });

      navigate("/dashboard");
    } catch (error) {
      console.error("Error saving story:", error);
      toast({
        variant: "destructive",
        title: "Error saving story",
        description: "Failed to save your story. Please try again."
      });
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
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