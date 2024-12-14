import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Music, Play, Pause } from "lucide-react";
import { useRef, useState } from "react";

interface MusicOption {
  id: string;
  name: string;
  file: string;
}

interface MusicSelectorProps {
  selectedMusic: string;
  onMusicSelect: (musicId: string) => void;
}

export function MusicSelector({ selectedMusic, onMusicSelect }: MusicSelectorProps) {
  const [previewVolume, setPreviewVolume] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const musicOptions: MusicOption[] = [
    { id: "gentle-lullaby", name: "Gentle Lullaby", file: "/assets/gentle-lullaby.mp3" },
    { id: "peaceful-dreams", name: "Peaceful Dreams", file: "/assets/peaceful-dreams.mp3" },
    { id: "nature-sounds", name: "Nature Sounds", file: "/assets/nature-sounds.mp3" },
    { id: "ocean-waves", name: "Ocean Waves", file: "/assets/ocean-waves.mp3" },
    { id: "soft-piano", name: "Soft Piano", file: "/assets/soft-piano.mp3" }
  ];

  const togglePreview = async (musicId: string) => {
    const musicOption = musicOptions.find(opt => opt.id === musicId);
    if (!musicOption) return;

    if (!audioRef.current) {
      audioRef.current = new Audio(musicOption.file);
      audioRef.current.loop = true;
      audioRef.current.volume = previewVolume;
    }

    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else if (audioRef.current) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setPreviewVolume(newVolume[0]);
    if (audioRef.current) {
      audioRef.current.volume = newVolume[0];
    }
  };

  return (
    <Card className="p-6 space-y-4 bg-white/90">
      <div className="flex items-center space-x-2 text-story-blue">
        <Music className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Background Music</h2>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {musicOptions.map((option) => (
          <div key={option.id} className="flex flex-col gap-2">
            <Button
              variant={selectedMusic === option.id ? "default" : "outline"}
              onClick={() => onMusicSelect(option.id)}
              className="text-sm"
            >
              {option.name}
            </Button>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => togglePreview(option.id)}
                className="h-8 w-8 p-0"
              >
                {isPlaying && selectedMusic === option.id ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
              <Slider
                value={[previewVolume]}
                max={1}
                step={0.1}
                onValueChange={handleVolumeChange}
                className="w-20"
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}