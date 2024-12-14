import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Music, Play, Pause } from "lucide-react";
import { useRef, useState } from "react";

interface MusicOption {
  id: string;
  name: string;
  file: string;
  category: "Lullaby" | "Nature" | "Ambient" | "Classical";
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
    { id: "gentle-lullaby", name: "Gentle Lullaby", file: "/assets/gentle-lullaby.mp3", category: "Lullaby" },
    { id: "peaceful-dreams", name: "Peaceful Dreams", file: "/assets/peaceful-dreams.mp3", category: "Lullaby" },
    { id: "nature-sounds", name: "Nature Sounds", file: "/assets/nature-sounds.mp3", category: "Nature" },
    { id: "ocean-waves", name: "Ocean Waves", file: "/assets/ocean-waves.mp3", category: "Nature" },
    { id: "soft-piano", name: "Soft Piano", file: "/assets/soft-piano.mp3", category: "Classical" }
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

  const categories = Array.from(new Set(musicOptions.map(opt => opt.category)));

  return (
    <Card className="p-6 space-y-6 bg-white/90 backdrop-blur-sm border border-blue-100">
      <div className="flex items-center space-x-2 text-blue-600">
        <Music className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Background Music</h2>
      </div>
      
      {categories.map(category => (
        <div key={category} className="space-y-3">
          <h3 className="text-sm font-medium text-blue-500">{category}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {musicOptions
              .filter(opt => opt.category === category)
              .map((option) => (
                <div key={option.id} className="flex flex-col gap-2 bg-white/80 p-3 rounded-lg">
                  <Button
                    variant={selectedMusic === option.id ? "default" : "outline"}
                    onClick={() => onMusicSelect(option.id)}
                    className="text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
                  >
                    {option.name}
                  </Button>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => togglePreview(option.id)}
                      className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700"
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
        </div>
      ))}
    </Card>
  );
}