import { Volume2, VolumeX, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MusicControlsProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (value: number[]) => void;
  onToggleMute: () => void;
  selectedMusic?: string;
  onMusicChange?: (value: string) => void;
}

const MUSIC_OPTIONS = {
  "no-music": "No Music",
  "sleeping-lullaby": "Sleeping Lullaby",
  "water-dreams": "Ocean Waves",
  "forest-birds": "Nature Sounds",
  "relaxing-piano": "Soft Piano",
  "gentle-dreams": "Peaceful Dreams"
};

export function MusicControls({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
  selectedMusic = "no-music",
  onMusicChange,
}: MusicControlsProps) {
  return (
    <div className="flex items-center space-x-4 bg-white/90 p-2 rounded-lg shadow-sm">
      <div className="flex items-center min-w-[140px]">
        <Music className="h-4 w-4 text-blue-500 mr-2" />
        <Select
          value={selectedMusic}
          onValueChange={onMusicChange}
        >
          <SelectTrigger className="w-[140px] h-8 text-sm">
            <SelectValue placeholder="Select music" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {Object.entries(MUSIC_OPTIONS).map(([value, label]) => (
              <SelectItem
                key={value}
                value={value}
                className="text-sm cursor-pointer hover:bg-blue-50"
              >
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggleMute}
          className="h-8 w-8"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
        <Slider
          value={[volume]}
          max={1}
          step={0.01}
          onValueChange={onVolumeChange}
          className="w-24"
          disabled={selectedMusic === "no-music"}
        />
      </div>
    </div>
  );
}