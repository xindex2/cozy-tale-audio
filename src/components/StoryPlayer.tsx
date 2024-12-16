import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import type { StorySettings } from "./StoryOptions";
import { aiService } from "@/services/aiService";
import { ChatPanel } from "./story-player/ChatPanel";
import { MusicControls } from "./story-player/MusicControls";
import { AudioManager } from "./story-player/AudioManager";
import { StoryDisplay } from "./story-player/StoryDisplay";
import { useToast } from "@/hooks/use-toast";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { LoadingState } from "./story-player/LoadingState";
import { StoryHeader } from "./story-player/StoryHeader";
import { PlayButton } from "./story-player/PlayButton";

interface Message {
  role: "user" | "assistant";
  content: string;
  audioUrl?: string;
  backgroundMusicUrl?: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface StoryPlayerProps {
  settings: StorySettings;
  onBack: () => void;
  onSave?: (title: string, content: string, audioUrl: string, backgroundMusicUrl: string) => void;
}

export function StoryPlayer({ settings, onBack, onSave }: StoryPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [musicVolume, setMusicVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
  const [currentMusicUrl, setCurrentMusicUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [storyTitle, setStoryTitle] = useState("");
  const [storyContent, setStoryContent] = useState("");
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const { toast } = useToast();

  const { data: apiKey } = useQuery({
    queryKey: ['eleven-labs-api-key'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_keys')
        .select('key_value')
        .eq('key_name', 'ELEVEN_LABS_API_KEY')
        .single();

      if (error) throw error;
      return data.key_value;
    },
  });

  useEffect(() => {
    if (apiKey) {
      aiService.setApiKey(apiKey);
      startStory();
    } else {
      toast({
        title: "API Key Required",
        description: "Please add your ElevenLabs API key in the Admin Dashboard.",
        variant: "destructive",
      });
    }
  }, [apiKey]);

  const startStory = async () => {
    setIsLoading(true);
    try {
      const { text, audioUrl, backgroundMusicUrl, title } = await aiService.startChat(settings);
      setStoryTitle(title || "Your Bedtime Story");
      setStoryContent(text);
      
      if (audioUrl) {
        setCurrentAudioUrl(audioUrl);
      }
      if (backgroundMusicUrl) {
        setCurrentMusicUrl(backgroundMusicUrl);
      }
      setIsPlaying(true);

      if (onSave) {
        onSave(title || "Your Bedtime Story", text, audioUrl || "", backgroundMusicUrl || "");
      }
    } catch (error) {
      console.error("Error starting story:", error);
      toast({
        title: "Error",
        description: "Failed to start the story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateQuiz = async () => {
    setIsGeneratingQuiz(true);
    try {
      const questions = await aiService.generateQuiz(storyContent, settings.language);
      setQuiz(questions);
      toast({
        title: "Quiz Generated",
        description: "Test your knowledge about the story!",
      });
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast({
        title: "Error",
        description: "Failed to generate quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    setIsSending(true);
    try {
      setMessages((prev) => [...prev, { role: "user", content: text }]);
      
      const response = await aiService.continueStory(text, settings.language);
      
      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          content: response.text, 
          audioUrl: response.audioUrl,
          backgroundMusicUrl: response.backgroundMusicUrl 
        },
      ]);
      
      if (response.audioUrl) {
        setCurrentAudioUrl(response.audioUrl);
      }
      if (response.backgroundMusicUrl) {
        setCurrentMusicUrl(response.backgroundMusicUrl);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to process your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 lg:p-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-4 lg:p-8 space-y-6 bg-gradient-to-r from-blue-50 to-blue-100 backdrop-blur-sm border border-blue-200">
            <StoryHeader
              onBack={onBack}
              title={storyTitle}
              volume={volume}
              isMuted={isMuted}
              onVolumeChange={(newVolume) => setVolume(newVolume[0])}
              onToggleMute={() => setIsMuted(!isMuted)}
            />

            <div className="flex items-center justify-end">
              <MusicControls
                volume={musicVolume}
                isMuted={isMusicMuted}
                onVolumeChange={(newVolume) => setMusicVolume(newVolume[0])}
                onToggleMute={() => setIsMusicMuted(!isMusicMuted)}
              />
            </div>

            <AudioManager
              voiceUrl={currentAudioUrl}
              backgroundMusicUrl={currentMusicUrl}
              isPlaying={isPlaying}
              volume={volume}
              isMuted={isMuted}
              musicVolume={musicVolume}
              isMusicMuted={isMusicMuted}
              onTimeUpdate={setCurrentTime}
            />

            <ErrorBoundary>
              <StoryDisplay
                text={storyContent}
                audioUrl={currentAudioUrl}
                isPlaying={isPlaying}
                currentTime={currentTime}
                duration={settings.duration * 60}
              />
            </ErrorBoundary>

            <PlayButton
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
            />
          </Card>
        </div>

        <div className="h-[600px] lg:h-[800px]">
          <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isSending}
            quiz={quiz}
            onGenerateQuiz={generateQuiz}
            isGeneratingQuiz={isGeneratingQuiz}
            language={settings.language}
          />
        </div>
      </div>
    </div>
  );
}