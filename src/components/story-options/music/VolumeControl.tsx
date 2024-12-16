import { Volume2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";

interface VolumeControlProps {
  volume: number;
  onVolumeChange: (value: number[]) => void;
}

export function VolumeControl({ volume, onVolumeChange }: VolumeControlProps) {
  return (
    <div className="flex items-center space-x-2">
      <Volume2 className="h-4 w-4 text-gray-500" />
      <Slider
        value={[volume]}
        max={1}
        step={0.01}
        onValueChange={onVolumeChange}
        className="w-32"
      />
    </div>
  );
}