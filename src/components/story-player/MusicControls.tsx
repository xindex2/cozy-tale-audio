import { MusicPlayer } from "./MusicPlayer";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Music } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MusicControlsProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (value: number[]) => void;
  onToggleMute: () => void;
  selectedMusic?: string;
}

export function MusicControls({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
  selectedMusic,
}: MusicControlsProps) {
  const [useMusic, setUseMusic] = useState(selectedMusic !== "no-music");
  const [currentMusic, setCurrentMusic] = useState<string | undefined>(selectedMusic);

  const musicOptions = [
    { 
      id: "sleeping-lullaby", 
      name: "Sleeping Lullaby",
      url: "/assets/gentle-lullaby.mp3"
    },
    { 
      id: "water-dreams", 
      name: "Water Dreams",
      url: "/assets/ocean-waves.mp3"
    },
    { 
      id: "forest-birds", 
      name: "Nature Sounds",
      url: "/assets/nature-sounds.mp3"
    },
    { 
      id: "relaxing-piano", 
      name: "Relaxing Piano",
      url: "/assets/soft-piano.mp3"
    },
    { 
      id: "gentle-dreams", 
      name: "Peaceful Dreams",
      url: "/assets/peaceful-dreams.mp3"
    },
  ];

  const getMusicUrl = (musicKey: string): string | null => {
    const option = musicOptions.find(opt => opt.id === musicKey);
    return option?.url || null;
  };

  const musicUrl = currentMusic ? getMusicUrl(currentMusic) : null;

  return (
    <Card className="p-4 space-y-4 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="flex items-center space-x-3">
        <Music className="h-6 w-6 text-blue-500" />
        <h2 className="text-lg font-semibold text-blue-500">Background Music</h2>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="use-music"
            checked={useMusic}
            onCheckedChange={(checked) => setUseMusic(checked as boolean)}
            className="data-[state=checked]:bg-blue-500"
          />
          <Label 
            htmlFor="use-music" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Enable background music
          </Label>
        </div>

        {useMusic && (
          <div className="space-y-4">
            <Select
              value={currentMusic}
              onValueChange={setCurrentMusic}
              disabled={!useMusic}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a music track" />
              </SelectTrigger>
              <SelectContent>
                {musicOptions.map((option) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {musicUrl && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <audio
                  controls
                  className="w-full"
                  src={musicUrl}
                  preload="metadata"
                >
                  Your browser does not support the audio element.
                </audio>
              </div>
            )}

            <MusicPlayer
              musicUrl={musicUrl}
              volume={volume}
              isMuted={isMuted}
              onVolumeChange={onVolumeChange}
              onToggleMute={onToggleMute}
            />
          </div>
        )}
      </div>
    </Card>
  );
}