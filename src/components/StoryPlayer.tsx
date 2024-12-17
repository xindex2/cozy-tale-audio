import { Card } from "@/components/ui/card";
import type { StorySettings } from "./StoryOptions";
import { ChatPanel } from "./story-player/ChatPanel";
import { MusicControls } from "./story-player/MusicControls";
import { AudioManager } from "./story-player/AudioManager";
import { StoryDisplay } from "./story-player/StoryDisplay";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { StoryHeader } from "./story-player/StoryHeader";
import { useStoryPlayer } from "@/hooks/useStoryPlayer";
import { useEffect, useState } from "react";
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
    if (usage && !initialStoryData) {
      setIsFreeTrial(usage.stories_created >= 1);
    }
  }, [usage, initialStoryData]);

  // Handle chat message with usage check
  const handleChatMessage = async (message: string) => {
    const canProceed = await checkAndIncrementUsage('chat_messages_sent');
    if (!canProceed) {
      setShowUpgradePrompt(true);
      return;
    }
    handleSendMessage(message);
  };

  // Handle quiz with usage check
  const handleQuizGeneration = async () => {
    const canProceed = await checkAndIncrementUsage('quiz_questions_answered');
    if (!canProceed) {
      setShowUpgradePrompt(true);
      return;
    }
    generateQuiz();
  };

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

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        <Card className="p-8">
          <LoadingState stage={loadingStage} />
        </Card>
      </div>
    );
  }

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
            />

            <AudioManager
              voiceUrl={currentAudioUrl || initialStoryData?.audioUrl || ''}
              backgroundMusicUrl={currentMusicUrl || initialStoryData?.backgroundMusicUrl || ''}
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
                isFreeTrial={isFreeTrial}
              />
            </ErrorBoundary>

            <MusicControls
              volume={musicVolume}
              isMuted={isMusicMuted}
              onVolumeChange={(newVolume) => setMusicVolume(newVolume[0])}
              onToggleMute={() => setIsMusicMuted(!isMusicMuted)}
              selectedMusic={settings?.music}
              onMusicChange={(music) => {
                if (settings) {
                  settings.music = music;
                }
              }}
            />
          </Card>
        </div>

        <div className="h-[600px] lg:h-[800px]">
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
