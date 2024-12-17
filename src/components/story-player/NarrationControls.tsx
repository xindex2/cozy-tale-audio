import { Button } from "@/components/ui/button";
import { Play, Pause } from "lucide-react";
import { AudioControls } from "./AudioControls";

interface NarrationControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  volume: number;
  isMuted: boolean;
  onVolumeChange: (newVolume: number[]) => void;
  onToggleMute: () => void;
}

export function NarrationControls({
  isPlaying,
  onTogglePlay,
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
}: NarrationControlsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        size="icon"
        onClick={onTogglePlay}
        className="rounded-full w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
        title={isPlaying ? "Pause story" : "Play story"}
      >
        {isPlaying ? (
          <Pause className="h-4 w-4" />
        ) : (
          <Play className="h-4 w-4 ml-0.5" />
        )}
      </Button>
      <AudioControls
        volume={volume}
        isMuted={isMuted}
        onVolumeChange={onVolumeChange}
        onToggleMute={onToggleMute}
      />
    </div>
  );
}