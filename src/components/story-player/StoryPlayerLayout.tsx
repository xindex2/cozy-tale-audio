import { Card } from "@/components/ui/card";
import { StoryHeader } from "./StoryHeader";
import { StoryDisplay } from "./StoryDisplay";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { MusicControls } from "./MusicControls";
import { ChatPanel } from "./ChatPanel";
import { UpgradePrompt } from "../UpgradePrompt";

interface StoryPlayerLayoutProps {
  title: string;
  content: string;
  audioUrl?: string;
  volume: number;
  isMuted: boolean;
  isPlaying: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  onTogglePlay: () => void;
  onBack: () => void;
  musicVolume: number;
  isMusicMuted: boolean;
  onMusicVolumeChange: (volume: number) => void;
  onMusicToggleMute: () => void;
  selectedMusic?: string;
  messages: any[];
  onSendMessage: (message: string) => void;
  isSending: boolean;
  quiz: any;
  onGenerateQuiz: () => void;
  isGeneratingQuiz: boolean;
  language: string;
  currentTime: number;
  duration: number;
  isFreeTrial: boolean;
  onAudioGenerated: (blob: Blob) => void;
  showUpgradePrompt: boolean;
  onUpgradePromptChange: (show: boolean) => void;
}

export function StoryPlayerLayout({
  title,
  content,
  audioUrl,
  volume,
  isMuted,
  isPlaying,
  onVolumeChange,
  onToggleMute,
  onTogglePlay,
  onBack,
  musicVolume,
  isMusicMuted,
  onMusicVolumeChange,
  onMusicToggleMute,
  selectedMusic,
  messages,
  onSendMessage,
  isSending,
  quiz,
  onGenerateQuiz,
  isGeneratingQuiz,
  language,
  currentTime,
  duration,
  isFreeTrial,
  onAudioGenerated,
  showUpgradePrompt,
  onUpgradePromptChange,
}: StoryPlayerLayoutProps) {
  return (
    <div className="w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-3 sm:p-4 lg:p-8 space-y-6 bg-white dark:bg-gray-800">
            <StoryHeader
              onBack={onBack}
              title={title}
              volume={volume}
              isMuted={isMuted}
              onVolumeChange={(newVolume) => onVolumeChange(newVolume[0])}
              onToggleMute={onToggleMute}
              isPlaying={isPlaying}
              onTogglePlay={onTogglePlay}
              audioUrl={audioUrl}
            />

            <ErrorBoundary>
              <StoryDisplay
                text={content}
                audioUrl={audioUrl}
                isPlaying={isPlaying}
                currentTime={currentTime}
                duration={duration}
                isFreeTrial={isFreeTrial}
                onAudioGenerated={onAudioGenerated}
              />
            </ErrorBoundary>
          </Card>
        </div>

        <div className="lg:h-[800px] space-y-4">
          <Card className="p-4">
            <MusicControls
              volume={musicVolume}
              isMuted={isMusicMuted}
              onVolumeChange={(newVolume) => onMusicVolumeChange(newVolume[0])}
              onToggleMute={onMusicToggleMute}
              selectedMusic={selectedMusic}
            />
          </Card>

          <ChatPanel
            messages={messages}
            onSendMessage={onSendMessage}
            isLoading={isSending}
            quiz={quiz}
            onGenerateQuiz={onGenerateQuiz}
            isGeneratingQuiz={isGeneratingQuiz}
            language={language}
          />
        </div>
      </div>

      <UpgradePrompt
        open={showUpgradePrompt}
        onOpenChange={onUpgradePromptChange}
      />
    </div>
  );
}