import { Button } from "@/components/ui/button";
import { SkipBack, Volume2, VolumeX } from "lucide-react";
import { AudioControls } from "./AudioControls";

interface StoryHeaderProps {
  onBack: () => void;
  title: string;
  volume: number;
  isMuted: boolean;
  onVolumeChange: (newVolume: number[]) => void;
  onToggleMute: () => void;
}

export function StoryHeader({
  onBack,
  title,
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
}: StoryHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
      <div className="flex items-center gap-4 w-full sm:w-auto">
        <Button variant="outline" size="icon" onClick={onBack} className="shrink-0">
          <SkipBack className="h-4 w-4" />
        </Button>
        <h1 className="text-lg sm:text-xl font-bold text-blue-800 truncate">{title}</h1>
      </div>
      <div className="flex items-center space-x-4">
        <AudioControls
          volume={volume}
          isMuted={isMuted}
          onVolumeChange={onVolumeChange}
          onToggleMute={onToggleMute}
        />
      </div>
    </div>
  );
}