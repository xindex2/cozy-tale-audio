import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Music, Play, Pause } from "lucide-react";
import { useRef, useState } from "react";

interface MusicOption {
  id: string;
  name: string;
  file: string | null;
  category: "None" | "Lullaby" | "Nature" | "Classical";
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
    { id: "no-music", name: "No Background Music", file: null, category: "None" },
    { id: "gentle-lullaby", name: "Gentle Lullaby", file: "/assets/gentle-lullaby.mp3", category: "Lullaby" },
    { id: "peaceful-dreams", name: "Peaceful Dreams", file: "/assets/peaceful-dreams.mp3", category: "Lullaby" },
    { id: "nature-sounds", name: "Nature Sounds", file: "/assets/nature-sounds.mp3", category: "Nature" },
    { id: "ocean-waves", name: "Ocean Waves", file: "/assets/ocean-waves.mp3", category: "Nature" },
    { id: "soft-piano", name: "Soft Piano", file: "/assets/soft-piano.mp3", category: "Classical" }
  ];

  const togglePreview = async (musicId: string) => {
    const musicOption = musicOptions.find(opt => opt.id === musicId);
    if (!musicOption || !musicOption.file) return;

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
    <Card className="p-8 space-y-6 bg-white shadow-lg rounded-3xl border-0">
      <div className="flex items-center space-x-3">
        <Music className="h-8 w-8 text-blue-500" />
        <h2 className="text-2xl font-semibold text-blue-500">Background Music</h2>
      </div>
      
      {categories.map(category => (
        <div key={category} className="space-y-4">
          <h3 className="text-lg font-medium text-blue-400">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {musicOptions
              .filter(opt => opt.category === category)
              .map((option) => (
                <div key={option.id} className="bg-white rounded-2xl p-4 border-2 border-blue-100">
                  <Button
                    variant={selectedMusic === option.id ? "default" : "outline"}
                    onClick={() => onMusicSelect(option.id)}
                    className={`w-full h-14 text-lg font-medium rounded-xl mb-3 transition-all duration-200 ${
                      selectedMusic === option.id 
                        ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg"
                        : "hover:bg-blue-50"
                    }`}
                  >
                    {option.name}
                  </Button>
                  {option.file && (
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => togglePreview(option.id)}
                        className="h-10 w-10 p-0 rounded-xl text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                      >
                        {isPlaying && selectedMusic === option.id ? (
                          <Pause className="h-6 w-6" />
                        ) : (
                          <Play className="h-6 w-6" />
                        )}
                      </Button>
                      <Slider
                        value={[previewVolume]}
                        max={1}
                        step={0.1}
                        onValueChange={handleVolumeChange}
                        className="flex-1"
                      />
                    </div>
                  )}
                </div>
            ))}
          </div>
        </div>
      ))}
    </Card>
  );
}