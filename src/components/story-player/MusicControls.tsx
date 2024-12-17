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
      id: "gentle-lullaby-1", 
      name: "Gentle Lullaby",
      url: "https://cdn.pixabay.com/download/audio/2023/09/05/audio_168a3e0caa.mp3"
    },
    { 
      id: "gentle-lullaby-2", 
      name: "Sweet Lullaby",
      url: "https://cdn.pixabay.com/download/audio/2023/05/16/audio_166b9c7242.mp3"
    },
    { 
      id: "water-dreams", 
      name: "Water Dreams",
      url: "https://cdn.pixabay.com/download/audio/2022/02/23/audio_ea70ad08e3.mp3"
    },
    { 
      id: "relaxing-piano", 
      name: "Relaxing Piano",
      url: "https://cdn.pixabay.com/download/audio/2024/11/04/audio_4956b4edd1.mp3"
    },
    { 
      id: "healing-fountain", 
      name: "Healing Fountain",
      url: "https://cdn.pixabay.com/download/audio/2024/09/10/audio_6e5d7d1912.mp3"
    },
    { 
      id: "ocean-piano", 
      name: "Ocean Piano",
      url: "https://cdn.pixabay.com/download/audio/2021/09/09/audio_478f62eb43.mp3"
    },
    { 
      id: "forest-birds", 
      name: "Forest Birds",
      url: "https://cdn.pixabay.com/download/audio/2022/02/12/audio_8ca49a7f20.mp3"
    },
    { 
      id: "sleep-music", 
      name: "Sleep Music",
      url: "https://cdn.pixabay.com/download/audio/2023/10/30/audio_66f4e26e42.mp3"
    },
    { 
      id: "guided-sleep", 
      name: "Guided Sleep",
      url: "https://cdn.pixabay.com/download/audio/2024/03/11/audio_2412defc6f.mp3"
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
              <MusicPlayer
                musicUrl={musicUrl}
                volume={volume}
                isMuted={isMuted}
                onVolumeChange={onVolumeChange}
                onToggleMute={onToggleMute}
              />
            )}
          </div>
        )}
      </div>
    </Card>
  );
}