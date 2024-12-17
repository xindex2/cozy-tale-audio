import { Volume2, VolumeX, Music, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useRef, useEffect } from "react";

interface MusicControlsProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (value: number[]) => void;
  onToggleMute: () => void;
  selectedMusic?: string;
  onMusicChange?: (value: string) => void;
}

const MUSIC_OPTIONS = {
  "no-music": { label: "No Music", url: null },
  "sleeping-lullaby": { label: "Sleeping Lullaby", url: "/assets/gentle-lullaby.mp3" },
  "water-dreams": { label: "Ocean Waves", url: "/assets/ocean-waves.mp3" },
  "forest-birds": { label: "Nature Sounds", url: "/assets/nature-sounds.mp3" },
  "relaxing-piano": { label: "Soft Piano", url: "/assets/soft-piano.mp3" },
  "gentle-dreams": { label: "Peaceful Dreams", url: "/assets/peaceful-dreams.mp3" }
};

export function MusicControls({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
  selectedMusic = "no-music",
  onMusicChange,
}: MusicControlsProps) {
  const [previewingMusic, setPreviewingMusic] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const handlePreview = (musicKey: string) => {
    const musicUrl = MUSIC_OPTIONS[musicKey as keyof typeof MUSIC_OPTIONS]?.url;
    
    if (!musicUrl) return;

    if (previewingMusic === musicKey) {
      // Stop preview
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPreviewingMusic(null);
    } else {
      // Start new preview
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(musicUrl);
      audio.volume = volume;
      audio.play();
      audioRef.current = audio;
      setPreviewingMusic(musicKey);
    }
  };

  return (
    <div className="flex items-center space-x-4 bg-white/90 p-4 rounded-lg shadow-sm">
      <div className="flex items-center min-w-[200px] space-x-2">
        <Music className="h-4 w-4 text-blue-500" />
        <Select
          value={selectedMusic}
          onValueChange={(value) => {
            if (previewingMusic) {
              handlePreview(previewingMusic); // Stop current preview
            }
            onMusicChange?.(value);
          }}
        >
          <SelectTrigger className="w-[180px] h-8 text-sm">
            <SelectValue placeholder="Select music" />
          </SelectTrigger>
          <SelectContent className="bg-white">
            {Object.entries(MUSIC_OPTIONS).map(([value, { label }]) => (
              <SelectItem
                key={value}
                value={value}
                className="text-sm cursor-pointer hover:bg-blue-50 flex items-center justify-between pr-2"
              >
                <span>{label}</span>
                {value !== "no-music" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 ml-2"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handlePreview(value);
                    }}
                  >
                    {previewingMusic === value ? (
                      <Pause className="h-3 w-3" />
                    ) : (
                      <Play className="h-3 w-3" />
                    )}
                  </Button>
                )}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex items-center space-x-2">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onToggleMute}
          className="h-8 w-8"
        >
          {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
        </Button>
        <Slider
          value={[volume]}
          max={1}
          step={0.01}
          onValueChange={(newVolume) => {
            onVolumeChange(newVolume);
            if (audioRef.current) {
              audioRef.current.volume = newVolume[0];
            }
          }}
          className="w-24"
          disabled={selectedMusic === "no-music"}
        />
      </div>
    </div>
  );
}