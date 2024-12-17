import { Volume2, VolumeX, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

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
  "sleeping-lullaby": { 
    label: "Sleeping Lullaby", 
    url: "/assets/gentle-lullaby.mp3"
  },
  "water-dreams": { 
    label: "Ocean Waves", 
    url: "/assets/ocean-waves.mp3"
  },
  "forest-birds": { 
    label: "Nature Sounds", 
    url: "/assets/nature-sounds.mp3"
  },
  "relaxing-piano": { 
    label: "Soft Piano", 
    url: "/assets/soft-piano.mp3"
  },
  "gentle-dreams": { 
    label: "Peaceful Dreams", 
    url: "/assets/peaceful-dreams.mp3"
  }
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
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handlePreview = async (musicKey: string) => {
    const musicUrl = MUSIC_OPTIONS[musicKey as keyof typeof MUSIC_OPTIONS]?.url;
    
    if (!musicUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setPreviewingMusic(null);
      return;
    }

    try {
      if (previewingMusic === musicKey && audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
        setPreviewingMusic(null);
      } else {
        if (audioRef.current) {
          audioRef.current.pause();
        }
        const audio = new Audio(musicUrl);
        
        // Add loading state feedback
        toast({
          title: "Loading music...",
          description: "Please wait while we prepare your background music.",
        });

        // Wait for the audio to be loaded
        await new Promise((resolve, reject) => {
          audio.addEventListener('canplaythrough', resolve);
          audio.addEventListener('error', reject);
          audio.load();
        });

        audio.volume = isMuted ? 0 : volume;
        audio.loop = true;
        await audio.play();
        
        audioRef.current = audio;
        setPreviewingMusic(musicKey);
        
        toast({
          title: "Music ready!",
          description: "Background music is now playing.",
        });
      }
    } catch (error) {
      console.error('Error playing music:', error);
      toast({
        title: "Error",
        description: "Failed to load music. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleMusicChange = (value: string) => {
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

      <div className="space-y-4">
        <Select value={selectedMusic} onValueChange={handleMusicChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select background music" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(MUSIC_OPTIONS).map(([value, { label }]) => (
              <SelectItem key={value} value={value} className="flex justify-between">
                <span>{label}</span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedMusic !== 'no-music' && MUSIC_OPTIONS[selectedMusic as keyof typeof MUSIC_OPTIONS]?.url && (
          <Button
            variant="outline"
            size="sm"
            className={`w-full ${
              previewingMusic === selectedMusic 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' 
                : 'hover:bg-blue-50 dark:hover:bg-blue-900'
            }`}
            onClick={() => handlePreview(selectedMusic)}
          >
            {previewingMusic === selectedMusic ? "Stop Preview" : "Preview Music"}
          </Button>
        )}
      </div>

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