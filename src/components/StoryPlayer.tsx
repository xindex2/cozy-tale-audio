import { Card } from "@/components/ui/card";
import type { StorySettings } from "./StoryOptions";
import { ChatPanel } from "./story-player/ChatPanel";
import { MusicControls } from "./story-player/MusicControls";
import { AudioManager } from "./story-player/AudioManager";
import { StoryDisplay } from "./story-player/StoryDisplay";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { StoryHeader } from "./story-player/StoryHeader";
import { PlayButton } from "./story-player/PlayButton";
import { useStoryPlayer } from "@/hooks/useStoryPlayer";
import { useEffect } from "react";
import { Loader } from "lucide-react";

interface StoryPlayerProps {
  settings: StorySettings;
  onBack: () => void;
  onSave?: (title: string, content: string, audioUrl: string, backgroundMusicUrl: string) => void;
  initialStoryData?: {
    title: string;
    content: string;
    audioUrl?: string;
    backgroundMusicUrl?: string;
  };
}

export function StoryPlayer({ settings, onBack, onSave, initialStoryData }: StoryPlayerProps) {
  const {
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    musicVolume,
    setMusicVolume,
    isMuted,
    setIsMuted,
    isMusicMuted,
    setIsMusicMuted,
    messages,
    currentAudioUrl,
    currentMusicUrl,
    isLoading,
    isSending,
    storyTitle,
    storyContent,
    quiz,
    isGeneratingQuiz,
    currentTime,
    setCurrentTime,
    startStory,
    generateQuiz,
    handleSendMessage,
    loadingStage
  } = useStoryPlayer(settings, onSave, initialStoryData);

  // Parse the content if it's a JSON string
  let displayContent = storyContent;
  let displayTitle = storyTitle;

  try {
    if (typeof storyContent === 'string' && storyContent.trim().startsWith('{')) {
      const parsed = JSON.parse(storyContent);
      displayContent = parsed.content || parsed.text || storyContent;
      displayTitle = parsed.title || storyTitle;
    }
  } catch (e) {
    console.error('Error parsing story content:', e);
    displayContent = storyContent;
  }

  // Ensure audio is properly initialized
  useEffect(() => {
    if (currentAudioUrl) {
      console.log("Audio URL available:", currentAudioUrl);
    }
  }, [currentAudioUrl]);

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-4 lg:p-6">
        <Card className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader className="h-8 w-8 animate-spin mx-auto text-blue-500" />
            <p className="text-blue-600 font-medium">
              {loadingStage === 'text' && "Creating your story..."}
              {loadingStage === 'audio' && "Generating audio..."}
              {loadingStage === 'music' && "Adding music..."}
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 lg:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-4 lg:p-8 space-y-6 bg-white">
            <StoryHeader
              onBack={onBack}
              title={displayTitle || initialStoryData?.title || ""}
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
              voiceUrl={currentAudioUrl || initialStoryData?.audioUrl}
              backgroundMusicUrl={currentMusicUrl || initialStoryData?.backgroundMusicUrl}
              isPlaying={isPlaying}
              volume={volume}
              isMuted={isMuted}
              musicVolume={musicVolume}
              isMusicMuted={isMusicMuted}
              onTimeUpdate={setCurrentTime}
            />

            <ErrorBoundary>
              <StoryDisplay
                text={displayContent || initialStoryData?.content || ""}
                audioUrl={currentAudioUrl || initialStoryData?.audioUrl}
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