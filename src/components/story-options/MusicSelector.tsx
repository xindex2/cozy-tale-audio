import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Music } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";

interface MusicSelectorProps {
  selectedMusic: string;
  onMusicSelect: (music: string) => void;
}

export function MusicSelector({ selectedMusic, onMusicSelect }: MusicSelectorProps) {
  const [useMusic, setUseMusic] = useState(selectedMusic !== "no-music");

  const musicOptions = [
    { id: "gentle-lullaby", name: "Gentle Lullaby", description: "Soft and calming melody perfect for bedtime" },
    { id: "peaceful-dreams", name: "Peaceful Dreams", description: "Soothing instrumental background music" },
    { id: "soft-piano", name: "Soft Piano", description: "Delicate piano melodies" },
    { id: "nature-sounds", name: "Nature Sounds", description: "Calming nature ambiance" },
    { id: "ocean-waves", name: "Ocean Waves", description: "Gentle ocean waves and soft music" },
  ];

  const handleMusicToggle = (checked: boolean) => {
    setUseMusic(checked);
    if (!checked) {
      onMusicSelect("no-music");
    } else {
      onMusicSelect(musicOptions[0].id); // Default to first option when enabling
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
          />
          <Label htmlFor="use-music">Enable background music</Label>
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