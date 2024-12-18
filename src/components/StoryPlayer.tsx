import { useEffect, useState, useCallback } from "react";
import type { StorySettings } from "./StoryOptions";
import { LoadingState } from "./story-player/LoadingState";
import { useToast } from "@/hooks/use-toast";
import { useUserUsage } from "@/hooks/useUserUsage";
import { useStoryPlayer } from "@/hooks/useStoryPlayer";
import { useStorySave } from "@/hooks/story/useStorySave";
import { uploadAudioToStorage } from "@/utils/audioStorage";
import { Card } from "./ui/card";
import { StoryPlayerLayout } from "./story-player/StoryPlayerLayout";

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

  useEffect(() => {
    if (currentAudioUrl && onSave && !isSaving && currentAudioUrl !== savedAudioUrl) {
      saveStory(storyTitle, storyContent, currentAudioUrl, currentMusicUrl || "");
    }
  }, [currentAudioUrl, currentMusicUrl, storyTitle, storyContent, onSave, isSaving, savedAudioUrl, saveStory]);

  const handleUpgradePrompt = useCallback(async (action: 'chat_messages_sent' | 'quiz_questions_answered') => {
    const canProceed = await checkAndIncrementUsage(action);
    if (!canProceed) {
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
    <StoryPlayerLayout
      title={storyTitle || initialStoryData?.title || ""}
      content={storyContent || initialStoryData?.content || ""}
      audioUrl={currentAudioUrl || initialStoryData?.audioUrl}
      volume={volume}
      isMuted={isMuted}
      isPlaying={isPlaying}
      onVolumeChange={setVolume}
      onToggleMute={() => setIsMuted(!isMuted)}
      onTogglePlay={() => setIsPlaying(!isPlaying)}
      onBack={onBack}
      musicVolume={musicVolume}
      isMusicMuted={isMusicMuted}
      onMusicVolumeChange={setMusicVolume}
      onMusicToggleMute={() => setIsMusicMuted(!isMusicMuted)}
      selectedMusic={settings?.music}
      messages={messages}
      onSendMessage={handleChatMessage}
      isSending={isSending}
      quiz={quiz}
      onGenerateQuiz={handleQuizGeneration}
      isGeneratingQuiz={isGeneratingQuiz}
      language={settings.language}
      currentTime={currentTime}
      duration={settings.duration * 60}
      isFreeTrial={isFreeTrial}
      onAudioGenerated={handleAudioUpload}
      showUpgradePrompt={showUpgradePrompt}
      onUpgradePromptChange={setShowUpgradePrompt}
    />
  );
}