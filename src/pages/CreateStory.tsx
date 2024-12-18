import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StoryOptions, type StorySettings } from "@/components/StoryOptions";
import { StoryPlayer } from "@/components/StoryPlayer";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
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
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  if (isLoading) {
    return <LoadingScreen />;
  }

  const handleStart = async (settings: StorySettings) => {
    try {
      if (!user) {
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
    if (!user || !storySettings) {
      console.error("Missing user or storySettings");
      toast({
        title: "Error",
        description: "Unable to save story. Please try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      console.log("Saving story...");
      const savedStory = await saveStory({
        userId: user.id,
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

      // Don't navigate away after saving
      console.log("Story saved:", savedStory);
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
                if (storySettings) {
                  localStorage.setItem('pendingStorySettings', JSON.stringify(storySettings));
                }
                navigate('/login', { replace: true, state: { from: '/create' } });
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