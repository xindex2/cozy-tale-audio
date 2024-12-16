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
import { Loader } from "lucide-react";
import { Progress } from "@/components/ui/progress";

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

  useEffect(() => {
    if (!initialStoryData && settings) {
      startStory(settings);
    }
  }, [settings, initialStoryData, startStory]);

  // Parse the content if it's a JSON string
  let displayContent = storyContent;
  try {
    if (typeof storyContent === 'string' && storyContent.trim().startsWith('{')) {
      const parsed = JSON.parse(storyContent);
      displayContent = parsed.text || parsed.content || storyContent;
    }
  } catch (e) {
    console.error('Error parsing story content:', e);
    displayContent = storyContent;
  }

  const getLoadingProgress = () => {
    switch (loadingStage) {
      case 'text':
        return 33;
      case 'audio':
        return 66;
      case 'music':
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 lg:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-4 lg:p-8 space-y-6 bg-gradient-to-r from-blue-50 to-blue-100 backdrop-blur-sm border border-blue-200">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <Loader className="h-8 w-8 animate-spin text-blue-500" />
                <p className="text-blue-600 font-medium">
                  {loadingStage === 'text' && "Creating your story..."}
                  {loadingStage === 'audio' && "Generating audio narration..."}
                  {loadingStage === 'music' && "Adding background music..."}
                </p>
                <div className="w-full max-w-md">
                  <Progress value={getLoadingProgress()} className="h-2" />
                </div>
              </div>
            ) : (
              <>
                <StoryHeader
                  onBack={onBack}
                  title={storyTitle || initialStoryData?.title || ""}
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
              </>
            )}
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