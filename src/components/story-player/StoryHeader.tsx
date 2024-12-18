import { Button } from "@/components/ui/button";
import { SkipBack } from "lucide-react";
import { PlyrPlayer } from "./PlyrPlayer";

interface StoryHeaderProps {
  onBack: () => void;
  title: string;
  volume: number;
  isMuted: boolean;
  onVolumeChange: (newVolume: number[]) => void;
  onToggleMute: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  audioUrl?: string | null;
}

export function StoryHeader({
  onBack,
  title,
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
  isPlaying,
  onTogglePlay,
  audioUrl,
}: StoryHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Button variant="outline" size="icon" onClick={onBack} className="shrink-0">
            <SkipBack className="h-4 w-4" />
          </Button>
          <h1 className="text-lg sm:text-xl font-bold text-blue-800 truncate">{title}</h1>
        </div>
      </div>
      {audioUrl && (
        <div className="w-full">
          <PlyrPlayer
            url={audioUrl}
            volume={volume}
            isMuted={isMuted}
            isPlaying={isPlaying}
            isMusic={false}
          />
        </div>
      )}
    </div>
  );
}