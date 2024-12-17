import { Volume2, VolumeX, Music, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
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
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPreviewingMusic(null);
    } else {
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
    <Card className="p-6 space-y-4 bg-white/90 dark:bg-gray-800/90 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-2">
        <Music className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-medium">Background Music</h3>
      </div>

      <RadioGroup
        value={selectedMusic}
        onValueChange={(value) => {
          if (previewingMusic) {
            handlePreview(previewingMusic);
          }
          onMusicChange?.(value);
        }}
        className="grid gap-3"
      >
        {Object.entries(MUSIC_OPTIONS).map(([value, { label, url }]) => (
          <div
            key={value}
            className="flex items-center space-x-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
          >
            <RadioGroupItem value={value} id={value} />
            <Label htmlFor={value} className="flex-1 cursor-pointer">{label}</Label>
            {url && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-1 hover:bg-blue-100 dark:hover:bg-blue-900"
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

      <div className="flex items-center space-x-4 pt-4 border-t border-gray-200 dark:border-gray-700">
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
