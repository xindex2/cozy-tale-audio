import { Button } from "@/components/ui/button";
import { SkipBack } from "lucide-react";
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
    <div className="flex justify-between items-center">
      <Button variant="outline" size="icon" onClick={onBack}>
        <SkipBack className="h-4 w-4" />
      </Button>
      <h1 className="text-xl lg:text-2xl font-bold text-blue-800">{title}</h1>
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