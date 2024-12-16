import { Button } from "@/components/ui/button";
import { Pause, Play } from "lucide-react";

interface PlayButtonProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export function PlayButton({ isPlaying, onTogglePlay }: PlayButtonProps) {
  return (
    <div className="flex justify-center">
      <Button
        size="icon"
        onClick={onTogglePlay}
        className="rounded-full w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
      >
        {isPlaying ? (
          <Pause className="h-6 w-6" />
        ) : (
          <Play className="h-6 w-6 ml-1" />
        )}
      </Button>
    </div>
  );
}