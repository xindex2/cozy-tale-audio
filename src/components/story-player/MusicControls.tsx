import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Music, Volume2, VolumeX, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

interface MusicControlsProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  selectedMusic?: string;
}

const musicOptions = [
  { id: "no-music", name: "No Music", url: null },
  { 
    id: "gentle-lullaby", 
    name: "Gentle Lullaby", 
    url: "https://cdn.pixabay.com/download/audio/2023/09/05/audio_168a3e0caa.mp3"
  },
  { 
    id: "sleeping-lullaby", 
    name: "Sleeping Lullaby", 
    url: "https://cdn.pixabay.com/download/audio/2023/05/16/audio_166b9c7242.mp3"
  },
  { 
    id: "water-dreams", 
    name: "Water Dreams", 
    url: "https://cdn.pixabay.com/download/audio/2022/02/23/audio_ea70ad08e3.mp3"
  },
  { 
    id: "relaxing-piano", 
    name: "Relaxing Piano", 
    url: "https://cdn.pixabay.com/download/audio/2024/11/04/audio_4956b4edd1.mp3"
  }
];

export function MusicControls({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
  selectedMusic,
}: MusicControlsProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const currentMusic = musicOptions.find(option => option.id === selectedMusic);

  useEffect(() => {
    if (selectedMusic) {
      setIsLoading(true);
      setError(null);
      
      const audio = new Audio();
      audio.src = currentMusic?.url || '';
      
      const handleCanPlay = () => {
        setIsLoading(false);
      };
      
      const handleError = () => {
        setIsLoading(false);
        setError("Failed to load music");
      };
      
      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('error', handleError);
      
      return () => {
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('error', handleError);
      };
    }
  }, [selectedMusic, currentMusic?.url]);

  return (
    <Card className="p-4 relative">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Music className="h-4 w-4 text-blue-500" />
            <h3 className="text-sm font-medium">Background Music</h3>
          </div>
          {isLoading && (
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          )}
        </div>

        <Select 
          value={selectedMusic || "no-music"}
          disabled={isLoading}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select music">
              {currentMusic?.name || "No Music"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {musicOptions.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="p-0 hover:bg-transparent"
            onClick={onToggleMute}
            disabled={isLoading}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]}
            min={0}
            max={1}
            step={0.1}
            className="w-full"
            onValueChange={(value) => onVolumeChange(value[0])}
            disabled={isLoading}
          />
        </div>
      </div>
    </Card>
  );
}