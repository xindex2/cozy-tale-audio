import { Volume2, VolumeX, Music } from "lucide-react";
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

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Update preview audio volume when main volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handlePreview = (musicKey: string) => {
    const musicUrl = MUSIC_OPTIONS[musicKey as keyof typeof MUSIC_OPTIONS]?.url;
    
    if (!musicUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPreviewingMusic(null);
      return;
    }

    if (previewingMusic === musicKey && audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setPreviewingMusic(null);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      const audio = new Audio(musicUrl);
      audio.volume = isMuted ? 0 : volume;
      audio.loop = true;
      audio.play().catch(console.error);
      audioRef.current = audio;
      setPreviewingMusic(musicKey);
    }
  };

  const handleMusicChange = (value: string) => {
    // Stop any preview when changing selection
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setPreviewingMusic(null);
    }
    onMusicChange?.(value);
  };

  return (
    <Card className="p-6 space-y-4 bg-white/90 dark:bg-gray-800/90 shadow-sm rounded-xl border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-2 mb-2">
        <Music className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-medium">Background Music</h3>
      </div>

      <RadioGroup
        value={selectedMusic}
        onValueChange={handleMusicChange}
        className="grid gap-3"
      >
        {Object.entries(MUSIC_OPTIONS).map(([value, { label, url }]) => (
          <div
            key={value}
            className="flex items-center space-x-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
          >
            <RadioGroupItem value={value} id={value} className="data-[state=checked]:bg-blue-500" />
            <Label htmlFor={value} className="flex-1 cursor-pointer">{label}</Label>
            {url && (
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 px-3 ${
                  previewingMusic === value 
                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                    : 'hover:bg-blue-50 dark:hover:bg-blue-900'
                }`}
                onClick={(e) => {
                  e.preventDefault();
                  handlePreview(value);
                }}
              >
                {previewingMusic === value ? "Stop" : "Preview"}
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
          onValueChange={onVolumeChange}
          className="w-full"
          disabled={selectedMusic === "no-music"}
        />
      </div>
    </Card>
  );
}