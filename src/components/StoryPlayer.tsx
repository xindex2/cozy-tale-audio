import { Card } from "@/components/ui/card";
import type { StorySettings } from "./StoryOptions";
import { ChatPanel } from "./story-player/ChatPanel";
import { MusicControls } from "./story-player/MusicControls";
import { AudioManager } from "./story-player/AudioManager";
import { StoryDisplay } from "./story-player/StoryDisplay";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { StoryHeader } from "./story-player/StoryHeader";
import { useStoryPlayer } from "@/hooks/useStoryPlayer";
import { useEffect, useState, useCallback } from "react";
import { LoadingState } from "./story-player/LoadingState";
import { useToast } from "@/hooks/use-toast";
import { useUserUsage } from "@/hooks/useUserUsage";
import { UpgradePrompt } from "./UpgradePrompt";

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
  const { toast } = useToast();
  const { usage, checkAndIncrementUsage } = useUserUsage();
  const [showUpgradePrompt, setShowUpgradePrompt] = useState(false);
  const [isFreeTrial, setIsFreeTrial] = useState(false);
  const [persistedAudioUrl, setPersistedAudioUrl] = useState<string | null>(null);
  const [persistedMusicUrl, setPersistedMusicUrl] = useState<string | null>(null);

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
    if (initialStoryData?.audioUrl) {
      setPersistedAudioUrl(initialStoryData.audioUrl);
    }
    if (initialStoryData?.backgroundMusicUrl) {
      setPersistedMusicUrl(initialStoryData.backgroundMusicUrl);
    }
  }, [initialStoryData]);

  useEffect(() => {
    if (usage && !initialStoryData) {
      setIsFreeTrial(usage.stories_created >= 1);
    }
  }, [usage, initialStoryData]);

  useEffect(() => {
    if (initialStoryData?.audioUrl) {
      setPersistedAudioUrl(initialStoryData.audioUrl);
    }
    if (initialStoryData?.backgroundMusicUrl) {
      setPersistedMusicUrl(initialStoryData.backgroundMusicUrl);
    }
  }, [initialStoryData]);

  useEffect(() => {
    if (currentAudioUrl && onSave) {
      onSave(
        storyTitle,
        storyContent,
        currentAudioUrl,
        currentMusicUrl || ""
      );
    }
  }, [currentAudioUrl, currentMusicUrl, storyTitle, storyContent, onSave]);

  // Debounced version of the upgrade prompt handler
  const handleUpgradePrompt = useCallback(async (action: 'chat_messages_sent' | 'quiz_questions_answered') => {
    const canProceed = await checkAndIncrementUsage(action);
    if (!canProceed) {
      // Use setTimeout to prevent immediate state updates
      setTimeout(() => {
        setShowUpgradePrompt(true);
      }, 100);
      return false;
    }
    return true;
  }, [checkAndIncrementUsage]);

  const handleChatMessage = async (message: string) => {
    const canProceed = await handleUpgradePrompt('chat_messages_sent');
    if (!canProceed) return;
    handleSendMessage(message);
  };

  const handleQuizGeneration = async () => {
    const canProceed = await handleUpgradePrompt('quiz_questions_answered');
    if (!canProceed) return;
    generateQuiz();
  };

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

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <Card className="p-8">
          <LoadingState stage={loadingStage} />
        </Card>
      </div>
    );
  }

  const currentDisplayAudioUrl = persistedAudioUrl || currentAudioUrl || initialStoryData?.audioUrl;

  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-3 sm:p-4 lg:p-8 space-y-6 bg-white dark:bg-gray-800">
            <StoryHeader
              onBack={onBack}
              title={displayTitle || initialStoryData?.title || ""}
              volume={volume}
              isMuted={isMuted}
              onVolumeChange={(newVolume) => setVolume(newVolume[0])}
              onToggleMute={() => setIsMuted(!isMuted)}
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              audioUrl={currentDisplayAudioUrl}
            />

            <ErrorBoundary>
              <StoryDisplay
                text={displayContent || initialStoryData?.content || ""}
                audioUrl={currentDisplayAudioUrl}
                isPlaying={isPlaying}
                currentTime={currentTime}
                duration={settings.duration * 60}
                isFreeTrial={isFreeTrial}
              />
            </ErrorBoundary>
          </Card>
        </div>

        <div className="lg:h-[800px] space-y-4">
          <Card className="p-4">
            <MusicControls
              volume={musicVolume}
              isMuted={isMusicMuted}
              onVolumeChange={(newVolume) => setMusicVolume(newVolume[0])}
              onToggleMute={() => setIsMusicMuted(!isMusicMuted)}
              selectedMusic={settings?.music}
            />
          </Card>

          <ChatPanel
            messages={messages}
            onSendMessage={handleChatMessage}
            isLoading={isSending}
            quiz={quiz}
            onGenerateQuiz={handleQuizGeneration}
            isGeneratingQuiz={isGeneratingQuiz}
            language={settings.language}
          />
        </div>
      </div>

      <UpgradePrompt
        open={showUpgradePrompt}
        onOpenChange={setShowUpgradePrompt}
      />
    </div>
  );
}
