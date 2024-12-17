import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Volume2, VolumeX, Play, Pause, Music } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MusicPlayerProps {
  musicUrl: string | null;
  volume: number;
  isMuted: boolean;
  onVolumeChange: (value: number[]) => void;
  onToggleMute: () => void;
}

export function MusicPlayer({
  musicUrl,
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
}: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!musicUrl) return;

    const audio = new Audio(musicUrl);
    audio.loop = true;
    audio.volume = isMuted ? 0 : volume;

    audio.addEventListener('canplay', () => {
      setIsLoading(false);
      if (isPlaying) {
        audio.play().catch(handlePlayError);
      }
    });

    audio.addEventListener('error', (e) => {
      console.error('Music loading error:', e);
      setError('Failed to load music');
      setIsLoading(false);
      toast({
        title: "Music Error",
        description: "Failed to load background music. Please try again.",
        variant: "destructive",
      });
    });

    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, [musicUrl]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handlePlayError = (error: any) => {
    console.error('Music playback error:', error);
    setError('Failed to play music');
    setIsPlaying(false);
    toast({
      title: "Playback Error",
      description: "Failed to play background music. Please try again.",
      variant: "destructive",
    });
  };

  const togglePlay = async () => {
    if (!audioRef.current || !musicUrl) return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        setIsLoading(true);
        await audioRef.current.play();
        setIsPlaying(true);
        setError(null);
      }
    } catch (error) {
      handlePlayError(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!musicUrl) return null;

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Music className="h-5 w-5 text-blue-500" />
          <h3 className="text-sm font-medium">Background Music</h3>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleMute}
            className="h-8 w-8"
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={togglePlay}
            disabled={isLoading}
            className="h-8 w-8"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Slider
          value={[volume]}
          max={1}
          step={0.01}
          onValueChange={onVolumeChange}
          className="w-full"
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
    </Card>
  );
}