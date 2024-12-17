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
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

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
    <Card className="p-4 space-y-4 bg-white/90 shadow-sm w-full max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <Music className="h-4 w-4 text-blue-500" />
        <h3 className="text-sm font-medium">Background Music</h3>
      </div>

      <RadioGroup
        value={selectedMusic}
        onValueChange={(value) => {
          if (previewingMusic) {
            handlePreview(previewingMusic); // Stop current preview
          }
          onMusicChange?.(value);
        }}
        className="grid gap-3"
      >
        {Object.entries(MUSIC_OPTIONS).map(([value, { label, url }]) => (
          <div key={value} className="flex items-center space-x-2">
            <RadioGroupItem value={value} id={value} />
            <Label htmlFor={value} className="flex-1">{label}</Label>
            {url && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-1"
                onClick={(e) => {
                  e.preventDefault();
                  handlePreview(value);
                }}
              >
                {previewingMusic === value ? (
                  <Pause className="h-4 w-4" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>
        ))}
      </RadioGroup>

      <div className="flex items-center space-x-4 pt-4 border-t">
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
          className="w-full"
          disabled={selectedMusic === "no-music"}
        />
      </div>
    </Card>
  );
}