import { Card } from "@/components/ui/card";
import { SynchronizedText } from "./SynchronizedText";

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
  const title = text.split('\n')[0].replace(/\*/g, '');
  const content = text.split('\n').slice(1).join('\n');

  return (
    <Card className="p-6 space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
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