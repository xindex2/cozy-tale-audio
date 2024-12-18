import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Music, Volume2, VolumeX } from "lucide-react";

interface MusicControlsProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  selectedMusic?: string;
}

const musicOptions = [
  { id: "no-music", name: "No Music", url: null },
  { 
    id: "gentle-lullaby", 
    name: "Gentle Lullaby", 
    url: "https://cdn.pixabay.com/download/audio/2023/09/05/audio_168a3e0caa.mp3?filename=gentle-lullaby-165122.mp3"
  },
  { 
    id: "sleeping-lullaby", 
    name: "Sleeping Lullaby", 
    url: "https://cdn.pixabay.com/download/audio/2023/05/16/audio_166b9c7242.mp3?filename=lullaby-sleeping-150140.mp3"
  },
  { 
    id: "water-dreams", 
    name: "Water Dreams", 
    url: "https://cdn.pixabay.com/download/audio/2022/02/23/audio_ea70ad08e3.mp3?filename=little-water-dreams-21491.mp3"
  },
  { 
    id: "relaxing-piano", 
    name: "Relaxing Piano", 
    url: "https://cdn.pixabay.com/download/audio/2024/11/04/audio_4956b4edd1.mp3?filename=relaxing-piano-music-259727.mp3"
  },
  { 
    id: "water-fountain", 
    name: "Water Fountain", 
    url: "https://cdn.pixabay.com/download/audio/2024/09/10/audio_6e5d7d1912.mp3?filename=water-fountain-healing-music-239455.mp3"
  },
  { 
    id: "ocean-waves", 
    name: "Ocean Waves", 
    url: "https://cdn.pixabay.com/download/audio/2021/09/09/audio_478f62eb43.mp3?filename=waves-and-tears-sad-piano-music-with-calm-ocean-waves-8164.mp3"
  },
  { 
    id: "forest-birds", 
    name: "Forest Birds", 
    url: "https://cdn.pixabay.com/download/audio/2022/02/12/audio_8ca49a7f20.mp3?filename=birds39-forest-20772.mp3"
  },
  { 
    id: "sleep-music", 
    name: "Sleep Music", 
    url: "https://cdn.pixabay.com/download/audio/2023/10/30/audio_66f4e26e42.mp3?filename=sleep-music-vol5-173983.mp3"
  },
  { 
    id: "guided-sleep", 
    name: "Guided Sleep", 
    url: "https://cdn.pixabay.com/download/audio/2024/03/11/audio_2412defc6f.mp3?filename=guided-sleep-195499.mp3"
  }
];

export function MusicControls({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
  selectedMusic,
}: MusicControlsProps) {
  const currentMusic = musicOptions.find(option => option.id === selectedMusic);

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Music className="h-4 w-4 text-blue-500" />
          <h3 className="text-sm font-medium">Background Music</h3>
        </div>

        <Select value={selectedMusic || "no-music"}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select music">
              {currentMusic?.name || "No Music"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {musicOptions.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="p-0 hover:bg-transparent"
            onClick={onToggleMute}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]}
            min={0}
            max={1}
            step={0.1}
            className="w-full"
            onValueChange={(value) => onVolumeChange(value[0])}
          />
        </div>
      </div>
    </Card>
  );
}