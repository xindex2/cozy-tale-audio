import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Music } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";

interface MusicSelectorProps {
  selectedMusic: string;
  onMusicSelect: (music: string) => void;
}

export function MusicSelector({ selectedMusic, onMusicSelect }: MusicSelectorProps) {
  const [useMusic, setUseMusic] = useState(selectedMusic !== "no-music");

  useEffect(() => {
    setUseMusic(selectedMusic !== "no-music");
  }, [selectedMusic]);

  const musicOptions = [
    { id: "gentle-lullaby", name: "Gentle Lullaby", description: "Soft and calming melody perfect for bedtime", url: "https://cdn.pixabay.com/download/audio/2023/09/05/audio_168a3e0caa.mp3" },
    { id: "sleeping-lullaby", name: "Sleeping Lullaby", description: "Peaceful lullaby for sweet dreams", url: "https://cdn.pixabay.com/download/audio/2023/05/16/audio_166b9c7242.mp3" },
    { id: "water-dreams", name: "Water Dreams", description: "Gentle water sounds with soft music", url: "https://cdn.pixabay.com/download/audio/2022/02/23/audio_ea70ad08e3.mp3" },
    { id: "relaxing-piano", name: "Relaxing Piano", description: "Soothing piano melodies", url: "https://cdn.pixabay.com/download/audio/2024/11/04/audio_4956b4edd1.mp3" },
    { id: "healing-fountain", name: "Healing Fountain", description: "Water fountain with healing music", url: "https://cdn.pixabay.com/download/audio/2024/09/10/audio_6e5d7d1912.mp3" },
    { id: "ocean-piano", name: "Ocean Piano", description: "Piano with calming ocean waves", url: "https://cdn.pixabay.com/download/audio/2021/09/09/audio_478f62eb43.mp3" },
    { id: "forest-birds", name: "Forest Birds", description: "Peaceful forest ambiance with birds", url: "https://cdn.pixabay.com/download/audio/2022/02/12/audio_8ca49a7f20.mp3" },
    { id: "sleep-music", name: "Sleep Music", description: "Gentle music for peaceful sleep", url: "https://cdn.pixabay.com/download/audio/2023/10/30/audio_66f4e26e42.mp3" },
    { id: "guided-sleep", name: "Guided Sleep", description: "Relaxing guided sleep music", url: "https://cdn.pixabay.com/download/audio/2024/03/11/audio_2412defc6f.mp3" },
  ];

  const handleMusicToggle = (checked: boolean) => {
    setUseMusic(checked);
    if (!checked) {
      onMusicSelect("no-music");
    } else if (selectedMusic === "no-music") {
      onMusicSelect(musicOptions[0].id);
    }
  };

  return (
    <Card className="p-8 space-y-6 bg-white shadow-lg rounded-3xl border-0">
      <div className="flex items-center space-x-3">
        <Music className="h-8 w-8 text-blue-500" />
        <h2 className="text-2xl font-semibold text-blue-500">Background Music</h2>
      </div>

      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="use-music"
            checked={useMusic}
            onCheckedChange={handleMusicToggle}
            className="data-[state=checked]:bg-blue-500"
          />
          <Label htmlFor="use-music" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
            Enable background music
          </Label>
        </div>

        {useMusic && (
          <RadioGroup
            value={selectedMusic}
            onValueChange={onMusicSelect}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            disabled={!useMusic}
          >
            {musicOptions.map((option) => (
              <div key={option.id} className="relative">
                <RadioGroupItem
                  value={option.id}
                  id={option.id}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={option.id}
                  className="flex flex-col p-4 border-2 rounded-xl cursor-pointer hover:bg-blue-50 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50"
                >
                  <span className="font-semibold text-lg">{option.name}</span>
                  <span className="text-sm text-gray-500">{option.description}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </div>
    </Card>
  );
}