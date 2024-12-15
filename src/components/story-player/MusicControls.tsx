import { Volume2, VolumeX, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface MusicControlsProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (value: number[]) => void;
  onToggleMute: () => void;
}

export function MusicControls({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
}: MusicControlsProps) {
  return (
    <div className="flex items-center space-x-4">
      <div className="flex items-center">
        <Music className="h-4 w-4 text-blue-500 mr-2" />
        <span className="text-sm text-blue-600">Music</span>
      </div>
      <Button variant="ghost" size="icon" onClick={onToggleMute}>
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </Button>
      <Slider
        value={[volume]}
        max={1}
        step={0.01}
        onValueChange={onVolumeChange}
        className="w-24"
      />
    </div>
  );
}