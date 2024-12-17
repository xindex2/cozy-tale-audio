import { useLocation, useNavigate, useParams } from "react-router-dom";
import { StoryPlayer } from "@/components/StoryPlayer";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LoadingScreen } from "@/components/ui/loading-screen";
import type { Story } from "@/types/story";
import { useToast } from "@/hooks/use-toast";

export default function StoryView() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [story, setStory] = useState<Story | null>(null);
  const { settings, initialStoryData } = location.state || {};
  const { toast } = useToast();

  useEffect(() => {
    async function fetchStory() {
      if (!id) {
        navigate("/stories");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("stories")
          .select("*")
          .eq("id", id)
          .single();

        if (error) {
          throw error;
        }
        
        if (!data) {
          toast({
            title: "Story not found",
            description: "The requested story could not be found.",
            variant: "destructive",
          });
          navigate("/stories");
          return;
        }

        console.log("Fetched story:", data);
        setStory(data);
      } catch (error) {
        console.error("Error fetching story:", error);
        toast({
          title: "Error",
          description: "Failed to load the story. Please try again.",
          variant: "destructive",
        });
        navigate("/stories");
      } finally {
        setIsLoading(false);
      }
    }

    if (!initialStoryData) {
      fetchStory();
    } else {
      setIsLoading(false);
    }
  }, [id, navigate, initialStoryData, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50">
        <Header />
        <main className="flex-1 container py-8">
          <LoadingScreen />
        </main>
        <Footer />
      </div>
    );
  }

  const storyData = initialStoryData || (story && {
    title: story.title,
    content: story.content,
    audioUrl: story.audio_url,
    backgroundMusicUrl: story.background_music_url,
  });

  if (!storyData) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50">
        <Header />
        <main className="flex-1 container py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Story Not Found</h2>
            <p className="mt-2 text-gray-600">The story you're looking for could not be found.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50">
      <Header />
      <main className="flex-1 container py-8">
        <StoryPlayer 
          settings={settings || story?.settings}
          onBack={() => navigate(-1)}
          initialStoryData={storyData}
        />
      </main>
      <Footer />
    </div>
  );
}