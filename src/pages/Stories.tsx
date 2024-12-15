import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Loader2, Plus, Play, Settings2 } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface Story {
  id: string;
  title: string;
  content: string;
  audio_url: string | null;
  background_music_url: string | null;
  settings: any;
  created_at: string;
}

export default function Stories() {
  const navigate = useNavigate();
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const { data: stories, isLoading, error } = useQuery({
    queryKey: ['stories'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return [];
      }

      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as Story[];
    },
  });

  const handlePlay = async (story: Story) => {
    if (audio) {
      audio.pause();
      setAudio(null);
      setIsPlaying(false);
    }

    if (story.audio_url) {
      const newAudio = new Audio(story.audio_url);
      if (story.background_music_url) {
        const backgroundMusic = new Audio(story.background_music_url);
        backgroundMusic.loop = true;
        backgroundMusic.volume = 0.15;
        await backgroundMusic.play();
      }
      newAudio.onended = () => {
        setIsPlaying(false);
        setAudio(null);
      };
      setAudio(newAudio);
      await newAudio.play();
      setIsPlaying(true);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
        <Header />
        <main className="container py-8">
          <div className="text-center text-red-600">
            Error loading stories. Please try again later.
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Header />
      <main className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Stories</h1>
          <Button onClick={() => navigate("/create-story")} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Story
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : stories && stories.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <Card key={story.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle>{story.title}</CardTitle>
                  <p className="text-sm text-gray-500">Created on {formatDate(story.created_at)}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 line-clamp-3">{story.content}</p>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedStory(story)}
                  >
                    <Settings2 className="h-4 w-4 mr-2" />
                    Settings
                  </Button>
                  {story.audio_url && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handlePlay(story)}
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Play Audio
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No stories yet. Create your first story!</p>
          </div>
        )}
      </main>
      <Footer />

      <Dialog open={!!selectedStory} onOpenChange={() => setSelectedStory(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Story Settings</DialogTitle>
          </DialogHeader>
          {selectedStory && (
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Age Group</h3>
                <p className="text-gray-600">{selectedStory.settings?.ageGroup || "Not specified"}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Duration</h3>
                <p className="text-gray-600">{selectedStory.settings?.duration || "Not specified"} minutes</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Theme</h3>
                <p className="text-gray-600">{selectedStory.settings?.theme || "Not specified"}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Language</h3>
                <p className="text-gray-600">{selectedStory.settings?.language || "Not specified"}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}