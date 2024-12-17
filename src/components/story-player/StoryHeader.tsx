import { Button } from "@/components/ui/button";
import { SkipBack, Volume2, VolumeX, Play, Pause } from "lucide-react";
import { AudioControls } from "./AudioControls";

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
          <Button
            size="icon"
            onClick={onTogglePlay}
            className="rounded-full w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            title={isPlaying ? "Pause story" : "Play story"}
          >
            {isPlaying ? (
              <Pause className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 ml-0.5" />
            )}
          </Button>
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
      <p className="text-sm text-gray-800 dark:text-gray-200 bg-story-orange/10 border border-story-orange/20 rounded-lg p-3 text-center sm:text-left shadow-sm">
        Click the play button to listen to the story narration. You can adjust the volume or mute the audio using the controls above.
      </p>
    </div>
  );
}