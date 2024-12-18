import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StoryOptions, type StorySettings } from "@/components/StoryOptions";
import { StoryPlayer } from "@/components/StoryPlayer";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { useAuthCheck } from "@/hooks/useAuthCheck";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { saveStory } from "@/services/storyService";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function CreateStory() {
  const [storySettings, setStorySettings] = useState<StorySettings | null>(null);
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const { userId, isLoading, error } = useAuthCheck();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !userId) {
      navigate("/auth");
    }
  }, [userId, isLoading, navigate]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    console.error("Authentication error:", error);
    toast({
      title: "Authentication Error",
      description: "Please try again later",
      variant: "destructive",
    });
    return null;
  }

  const handleStart = async (settings: StorySettings) => {
    try {
      if (!userId) {
        setStorySettings(settings);
        setShowAuthDialog(true);
        return;
      }
      
      console.log("Starting story creation with settings:", settings);
      setStorySettings(settings);
    } catch (error) {
      console.error("Error starting story:", error);
      toast({
        title: "Error",
        description: "Failed to start story creation. Please try again.",
        variant: "destructive",
      });
    }
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
      console.error("Missing userId or storySettings");
      toast({
        title: "Error",
        description: "Unable to save story. Please try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Saving story...");
      await saveStory({
        userId,
        title,
        content,
        audioUrl,
        backgroundMusicUrl,
        settings: storySettings
      });

      toast({
        title: "Success",
        description: "Your story has been saved successfully."
      });

    } catch (error) {
      console.error("Error saving story:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save your story. Please try again."
      });
    }
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

      <AlertDialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create an Account</AlertDialogTitle>
            <AlertDialogDescription>
              To generate and save your personalized story, you'll need to create a free account. It only takes a minute!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowAuthDialog(false)}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowAuthDialog(false);
                // Store settings in localStorage before redirecting
                if (storySettings) {
                  localStorage.setItem('pendingStorySettings', JSON.stringify(storySettings));
                }
                navigate('/auth');
              }}
            >
              Create Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}