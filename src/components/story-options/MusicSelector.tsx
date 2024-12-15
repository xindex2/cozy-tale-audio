import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Music, Play, Pause, Volume2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface MusicSelectorProps {
  selectedMusic: string;
  onMusicSelect: (music: string) => void;
}

export function MusicSelector({ selectedMusic, onMusicSelect }: MusicSelectorProps) {
  const [useMusic, setUseMusic] = useState(selectedMusic !== "no-music");
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [previewVolume, setPreviewVolume] = useState(0.15); // Default volume at 15%
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    setUseMusic(selectedMusic !== "no-music");
  }, [selectedMusic]);

  const musicOptions = [
    { id: "gentle-lullaby", name: "Gentle Lullaby", description: "Soft and calming melody perfect for bedtime", url: "/assets/gentle-lullaby.mp3" },
    { id: "sleeping-lullaby", name: "Sleeping Lullaby", description: "Peaceful lullaby for sweet dreams", url: "/assets/peaceful-dreams.mp3" },
    { id: "water-dreams", name: "Water Dreams", description: "Gentle water sounds with soft music", url: "/assets/ocean-waves.mp3" },
    { id: "relaxing-piano", name: "Relaxing Piano", description: "Soothing piano melodies", url: "/assets/soft-piano.mp3" },
    { id: "healing-fountain", name: "Healing Fountain", description: "Water fountain with healing music", url: "https://cdn.pixabay.com/download/audio/2024/09/10/audio_6e5d7d1912.mp3" },
    { id: "ocean-piano", name: "Ocean Piano", description: "Piano with calming ocean waves", url: "https://cdn.pixabay.com/download/audio/2021/09/09/audio_478f62eb43.mp3" },
    { id: "forest-birds", name: "Forest Birds", description: "Peaceful forest ambiance with birds", url: "/assets/nature-sounds.mp3" },
    { id: "sleep-music", name: "Sleep Music", description: "Gentle music for peaceful sleep", url: "https://cdn.pixabay.com/download/audio/2023/10/30/audio_66f4e26e42.mp3" },
    { id: "guided-sleep", name: "Guided Sleep", description: "Relaxing guided sleep music", url: "https://cdn.pixabay.com/download/audio/2024/03/11/audio_2412defc6f.mp3" },
  ];

  const handleMusicToggle = (checked: boolean) => {
    setUseMusic(checked);
    if (!checked) {
      onMusicSelect("no-music");
      stopPreview();
    } else if (selectedMusic === "no-music") {
      onMusicSelect(musicOptions[0].id);
    }
  };

  const togglePreview = (musicId: string, url: string) => {
    if (playingId === musicId) {
      stopPreview();
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(url);
      audio.volume = previewVolume;
      audio.play();
      audioRef.current = audio;
      setPlayingId(musicId);

      audio.addEventListener('ended', () => {
        setPlayingId(null);
        audioRef.current = null;
      });
    }
  };

  const stopPreview = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setPlayingId(null);
  };

  useEffect(() => {
    return () => {
      stopPreview();
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = previewVolume;
    }
  }, [previewVolume]);

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

        <div className="flex items-center space-x-2">
          <Volume2 className="h-4 w-4 text-gray-500" />
          <Slider
            value={[previewVolume]}
            max={1}
            step={0.01}
            onValueChange={(value) => setPreviewVolume(value[0])}
            className="w-32"
          />
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
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <span className="font-semibold text-lg">{option.name}</span>
                      <p className="text-sm text-gray-500">{option.description}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        togglePreview(option.id, option.url);
                      }}
                      className="ml-2"
                    >
                      {playingId === option.id ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </div>
    </Card>
  );
}
