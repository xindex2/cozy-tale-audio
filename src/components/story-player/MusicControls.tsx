import { Card } from "@/components/ui/card";
import { ShikwasaPlayer } from "./ShikwasaPlayer";

interface MusicControlsProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (newVolume: number[]) => void;
  onToggleMute: () => void;
  selectedMusic?: string;
}

export function MusicControls({
  volume,
  isMuted,
  selectedMusic,
}: MusicControlsProps) {
  if (!selectedMusic) return null;

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <h3 className="text-sm font-medium">Background Music</h3>
        <ShikwasaPlayer
          url={selectedMusic}
          volume={volume}
          isMuted={isMuted}
          isPlaying={true}
          isMusic={true}
        />
      </div>
    </Card>
  );
}