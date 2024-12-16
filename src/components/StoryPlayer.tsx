import { Card } from "@/components/ui/card";
import type { StorySettings } from "./StoryOptions";
import { ChatPanel } from "./story-player/ChatPanel";
import { MusicControls } from "./story-player/MusicControls";
import { AudioManager } from "./story-player/AudioManager";
import { StoryDisplay } from "./story-player/StoryDisplay";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LoadingState } from "./story-player/LoadingState";
import { StoryHeader } from "./story-player/StoryHeader";
import { PlayButton } from "./story-player/PlayButton";
import { useStoryPlayer } from "@/hooks/useStoryPlayer";
import { useEffect } from "react";

interface StoryPlayerProps {
  settings: StorySettings;
  onBack: () => void;
  onSave?: (title: string, content: string, audioUrl: string, backgroundMusicUrl: string) => void;
}

export function StoryPlayer({ settings, onBack, onSave }: StoryPlayerProps) {
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
  } = useStoryPlayer(settings, onSave);

  useEffect(() => {
    startStory();
  }, []);

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