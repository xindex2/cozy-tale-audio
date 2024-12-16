import { Card } from "@/components/ui/card";
import { RadioGroup } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Music } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { MusicOption } from "./music/MusicOption";
import { VolumeControl } from "./music/VolumeControl";
import { useAudioPreview } from "./music/useAudioPreview";

interface MusicSelectorProps {
  selectedMusic: string;
  onMusicSelect: (music: string) => void;
}

export function MusicSelector({ selectedMusic, onMusicSelect }: MusicSelectorProps) {
  const [useMusic, setUseMusic] = useState(selectedMusic !== "no-music");
  const [previewVolume, setPreviewVolume] = useState(0.15);
  
  const { playingId, togglePreview } = useAudioPreview(previewVolume);

  useEffect(() => {
    setUseMusic(selectedMusic !== "no-music");
  }, [selectedMusic]);

  const musicOptions = [
    { id: "gentle-lullaby", name: "Gentle Lullaby", description: "Soft and calming melody perfect for bedtime", url: "/assets/gentle-lullaby.mp3" },
    { id: "peaceful-dreams", name: "Peaceful Dreams", description: "Soothing lullaby for sweet dreams", url: "/assets/peaceful-dreams.mp3" },
    { id: "ocean-waves", name: "Ocean Waves", description: "Gentle water sounds with soft music", url: "/assets/ocean-waves.mp3" },
    { id: "soft-piano", name: "Relaxing Piano", description: "Soothing piano melodies", url: "/assets/soft-piano.mp3" },
    { id: "healing-fountain", name: "Healing Fountain", description: "Water fountain with healing music", url: "/assets/healing-fountain.mp3" },
    { id: "ocean-piano", name: "Ocean Piano", description: "Piano with calming ocean waves", url: "/assets/ocean-piano.mp3" },
    { id: "nature-sounds", name: "Forest Birds", description: "Peaceful forest ambiance with birds", url: "/assets/nature-sounds.mp3" },
    { id: "sleep-music", name: "Sleep Music", description: "Gentle music for peaceful sleep", url: "/assets/sleep-music.mp3" },
    { id: "guided-sleep", name: "Guided Sleep", description: "Relaxing guided sleep music", url: "/assets/guided-sleep.mp3" },
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
          <Label 
            htmlFor="use-music" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Enable background music
          </Label>
        </div>

        <VolumeControl 
          volume={previewVolume}
          onVolumeChange={(value) => setPreviewVolume(value[0])}
        />

        {useMusic && (
          <RadioGroup
            value={selectedMusic}
            onValueChange={onMusicSelect}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            disabled={!useMusic}
          >
            {musicOptions.map((option) => (
              <MusicOption
                key={option.id}
                id={option.id}
                name={option.name}
                description={option.description}
                isPlaying={playingId === option.id}
                onPreviewToggle={() => togglePreview(option.id, option.url)}
              />
            ))}
          </RadioGroup>
        )}
      </div>
    </Card>
  );
}