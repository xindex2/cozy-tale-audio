import { Card } from "@/components/ui/card";
import { SynchronizedText } from "./SynchronizedText";
import { PlyrPlayer } from "./PlyrPlayer";
import { useIsMobile } from "@/hooks/use-mobile";

interface StoryDisplayProps {
  text: string;
  audioUrl?: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isFreeTrial: boolean;
  onAudioGenerated?: (blob: Blob) => Promise<void>;
}

export function StoryDisplay({
  text,
  audioUrl,
  isPlaying,
  currentTime,
  duration,
  isFreeTrial,
  onAudioGenerated
}: StoryDisplayProps) {
  const isMobile = useIsMobile();
  const cleanTitle = text.split('\n')[0].replace(/\*/g, '');
  const content = text.split('\n').slice(1).join('\n').replace(/\*\*(.*?)\*\*/g, '$1');

  return (
    <Card className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">{cleanTitle}</h1>
      
      {isMobile && audioUrl && (
        <div className="w-full mb-4">
          <PlyrPlayer
            url={audioUrl}
            volume={1}
            isMuted={false}
            isPlaying={isPlaying}
            onTimeUpdate={(time) => console.log("Time update:", time)}
          />
        </div>
      )}

      <SynchronizedText
        text={content}
        audioUrl={audioUrl}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        isFreeTrial={isFreeTrial}
        onAudioGenerated={onAudioGenerated}
      />
    </Card>
  );
}