import { Button } from "@/components/ui/button";
import { ChevronLeft, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface StoryHeaderProps {
  onBack: () => void;
  title: string;
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
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
}: StoryHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={onBack}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            onClick={onToggleMute}
          >
            {isMuted ? (
              <VolumeX className="h-6 w-6" />
            ) : (
              <Volume2 className="h-6 w-6" />
            )}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]}
            min={0}
            max={1}
            step={0.1}
            className="w-24"
            onValueChange={(value) => onVolumeChange(value[0])}
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={onTogglePlay}
        >
          {isPlaying ? (
            <Pause className="h-6 w-6" />
          ) : (
            <Play className="h-6 w-6" />
          )}
        </Button>
      </div>
    </div>
  );
}