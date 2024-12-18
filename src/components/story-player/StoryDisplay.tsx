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
  
  // Extract title and content, removing asterisks and extra whitespace
  const lines = text.split('\n');
  const title = lines[0].replace(/\*/g, '').trim();
  const content = lines.slice(1).join('\n').replace(/\*\*/g, '').trim();

  return (
    <Card className="p-6 space-y-6 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
      <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-center">
        {title}
      </h1>
      
      {audioUrl && (
        <div className="w-full mb-6 rounded-lg overflow-hidden shadow-md">
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

      <div className="prose prose-lg max-w-none dark:prose-invert">
        <SynchronizedText
          text={content}
          audioUrl={audioUrl}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          isFreeTrial={isFreeTrial}
          onAudioGenerated={onAudioGenerated}
        />
      </div>
    </Card>
  );
}