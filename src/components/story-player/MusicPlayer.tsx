import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX } from "lucide-react";

interface MusicPlayerProps {
  musicUrl: string | null;
  volume: number;
  isMuted: boolean;
  onVolumeChange: (value: number[]) => void;
  onToggleMute: () => void;
}

export function MusicPlayer({
  musicUrl,
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
}: MusicPlayerProps) {
  if (!musicUrl) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleMute}
            className="h-8 w-8"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      <Slider
        value={[volume]}
        max={1}
        step={0.01}
        onValueChange={onVolumeChange}
        className="w-full"
      />
    </div>
  );
}