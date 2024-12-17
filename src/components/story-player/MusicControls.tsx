import { MusicPlayer } from "./MusicPlayer";
import { Card } from "@/components/ui/card";
import { RadioGroup } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Music } from "lucide-react";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

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

  const musicOptions = [
    { 
      id: "sleeping-lullaby", 
      name: "Sleeping Lullaby", 
      description: "Gentle lullaby for peaceful sleep", 
      url: "/assets/gentle-lullaby.mp3"
    },
    { 
      id: "water-dreams", 
      name: "Water Dreams", 
      description: "Calming water sounds with soft music", 
      url: "/assets/ocean-waves.mp3"
    },
    { 
      id: "forest-birds", 
      name: "Nature Sounds", 
      description: "Peaceful nature ambiance", 
      url: "/assets/nature-sounds.mp3"
    },
    { 
      id: "relaxing-piano", 
      name: "Relaxing Piano", 
      description: "Soft piano melodies for bedtime", 
      url: "/assets/soft-piano.mp3"
    },
    { 
      id: "gentle-dreams", 
      name: "Peaceful Dreams", 
      description: "Soft and calming melody for sweet dreams", 
      url: "/assets/peaceful-dreams.mp3"
    },
  ];

  const getMusicUrl = (musicKey: string): string | null => {
    const option = musicOptions.find(opt => opt.id === musicKey);
    return option?.url || null;
  };

  const musicUrl = selectedMusic ? getMusicUrl(selectedMusic) : null;

  return (
    <div className="space-y-4">
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
          <RadioGroup
            value={selectedMusic}
            className="grid grid-cols-1 gap-4"
            disabled={!useMusic}
          >
            {musicOptions.map((option) => (
              <div key={option.id} className="relative">
                <Label
                  htmlFor={option.id}
                  className="flex flex-col p-4 border-2 rounded-xl cursor-pointer hover:bg-blue-50 
                    peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50"
                >
                  <div className="flex flex-col space-y-2">
                    <span className="font-semibold text-lg">{option.name}</span>
                    <p className="text-sm text-gray-500">{option.description}</p>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}

        <MusicPlayer
          musicUrl={musicUrl}
          volume={volume}
          isMuted={isMuted}
          onVolumeChange={onVolumeChange}
          onToggleMute={onToggleMute}
        />
      </div>
    </div>
  );
}