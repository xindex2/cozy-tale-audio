import { useLocation, useNavigate, useParams } from "react-router-dom";
import { StoryPlayer } from "@/components/StoryPlayer";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LoadingState } from "@/components/story-player/LoadingState";
import type { Story } from "@/types/story";

export default function StoryView() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [story, setStory] = useState<Story | null>(null);
  const { settings, initialStoryData } = location.state || {};

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

        if (error) throw error;
        if (!data) {
          navigate("/stories");
          return;
        }

        setStory(data);
      } catch (error) {
        console.error("Error fetching story:", error);
        navigate("/stories");
      } finally {
        setIsLoading(false);
      }
    }

    // Only fetch if we don't have initialStoryData
    if (!initialStoryData) {
      fetchStory();
    } else {
      setIsLoading(false);
    }
  }, [id, navigate, initialStoryData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50">
        <Header />
        <main className="flex-1 container py-8">
          <LoadingState />
        </main>
        <Footer />
      </div>
    );
  }

  // Use either the fetched story data or the initial data passed through navigation
  const storyData = initialStoryData || (story && {
    title: story.title,
    content: story.content,
    audioUrl: story.audio_url,
    backgroundMusicUrl: story.background_music_url,
  });

  if (!storyData) return null;

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