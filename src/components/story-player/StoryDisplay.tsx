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
  // Remove asterisks from title and clean up formatting
  const titleMatch = text.match(/^[*\s]*(.+?)[*\s]*$/m);
  const title = titleMatch ? titleMatch[1].trim() : "";
  const content = text.split('\n').slice(1).join('\n').replace(/\*\*/g, '');

  return (
    <Card className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
      
      {audioUrl && (
        <div className="w-full mb-6">
          <PlyrPlayer
            url={audioUrl}
            volume={1}
            isMuted={false}
            isPlaying={isPlaying}
            onTimeUpdate={(time) => console.log("Time update:", time)}
            showVolumeControl={false}
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