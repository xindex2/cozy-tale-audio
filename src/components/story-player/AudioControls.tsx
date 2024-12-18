import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX } from "lucide-react";

interface AudioControlsProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (value: number) => void;
  onToggleMute: () => void;
}

export function AudioControls({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
}: AudioControlsProps) {
  return (
    <div className="flex items-center space-x-4">
      <Button variant="ghost" size="icon" onClick={onToggleMute}>
        {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </Button>
      <Slider
        value={[volume]}
        max={1}
        step={0.1}
        onValueChange={(values) => onVolumeChange(values[0])}
        className="w-32"
      />
    </div>
  );
}