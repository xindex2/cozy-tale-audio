import { Button } from "@/components/ui/button";
import { SkipBack } from "lucide-react";
import { NarrationControls } from "./NarrationControls";

interface StoryHeaderProps {
  onBack: () => void;
  title: string;
  volume: number;
  isMuted: boolean;
  onVolumeChange: (newVolume: number[]) => void;
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
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <Button variant="outline" size="icon" onClick={onBack} className="shrink-0">
            <SkipBack className="h-4 w-4" />
          </Button>
          <h1 className="text-lg sm:text-xl font-bold text-blue-800 truncate">{title}</h1>
        </div>
      </div>
      <div className="flex items-center justify-between bg-story-orange/10 border border-story-orange/20 rounded-lg p-3 text-sm text-gray-800 dark:text-gray-200">
        <span>Click play to listen to the story narration</span>
        <NarrationControls
          isPlaying={isPlaying}
          onTogglePlay={onTogglePlay}
          volume={volume}
          isMuted={isMuted}
          onVolumeChange={onVolumeChange}
          onToggleMute={onToggleMute}
        />
      </div>
    </div>
  );
}