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
import { useStorySave } from "@/hooks/story/useStorySave";

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
  const [isUploading, setIsUploading] = useState(false);
  const { saveStory, isSaving, savedAudioUrl } = useStorySave(onSave);

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
    loadingStage,
  } = useStoryPlayer(settings, onSave, initialStoryData);

  // Handle audio blob upload
  const handleAudioUpload = async (audioBlob: Blob) => {
    if (isUploading) return;
    setIsUploading(true);

    try {
      const fileName = `${storyTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-${Date.now()}-audio.mp3`;
      const audioUrl = await uploadAudioToStorage(audioBlob, fileName);
      
      if (!audioUrl) {
        throw new Error('Failed to upload audio file');
      }

      console.log("Audio uploaded successfully:", audioUrl);
      if (onSave) {
        saveStory(storyTitle, storyContent, audioUrl, currentMusicUrl || "");
      }
      
    } catch (error) {
      console.error("Error uploading audio:", error);
      toast({
        title: "Error",
        description: "Failed to upload audio file. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    if (usage && !initialStoryData) {
      setIsFreeTrial(usage.stories_created >= 1);
    }
  }, [usage, initialStoryData]);

  // Save story when audio URL changes
  useEffect(() => {
    if (currentAudioUrl && onSave && !isSaving && currentAudioUrl !== savedAudioUrl) {
      saveStory(storyTitle, storyContent, currentAudioUrl, currentMusicUrl || "");
    }
  }, [currentAudioUrl, currentMusicUrl, storyTitle, storyContent, onSave, isSaving, savedAudioUrl, saveStory]);

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
              title={storyTitle || initialStoryData?.title || ""}
              volume={volume}
              isMuted={isMuted}
              onVolumeChange={(newVolume) => setVolume(newVolume[0])}
              onToggleMute={() => setIsMuted(!isMuted)}
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              audioUrl={currentAudioUrl || initialStoryData?.audioUrl}
            />

            <ErrorBoundary>
              <StoryDisplay
                text={storyContent || initialStoryData?.content || ""}
                audioUrl={currentAudioUrl || initialStoryData?.audioUrl}
                isPlaying={isPlaying}
                currentTime={currentTime}
                duration={settings.duration * 60}
                isFreeTrial={isFreeTrial}
                onAudioGenerated={handleAudioUpload}
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
            onSendMessage={handleSendMessage}
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
