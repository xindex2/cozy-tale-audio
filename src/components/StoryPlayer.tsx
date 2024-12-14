import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Pause, Play, SkipBack, Volume2, VolumeX } from "lucide-react";
import type { StorySettings } from "./StoryOptions";

interface StoryPlayerProps {
  settings: StorySettings;
  onBack: () => void;
}

export function StoryPlayer({ settings, onBack }: StoryPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (settings.music) {
      audioRef.current = new Audio("/lullaby.mp3"); // You'll need to add this audio file
      audioRef.current.loop = true;
      audioRef.current.volume = volume;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [settings.music]);

  useEffect(() => {
    if (isPlaying) {
      if (settings.music && audioRef.current) {
        audioRef.current.play();
      }
      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            if (audioRef.current) {
              audioRef.current.pause();
            }
            return 100;
          }
          return prev + 100 / (settings.duration * 60);
        });
      }, 1000);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, settings.duration, settings.music]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume[0]);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-8 animate-fade-in">
      <Card className="p-8 space-y-6">
        <div className="relative w-32 h-32 mx-auto animate-float">
          <div className="absolute inset-0 bg-story-purple rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute inset-2 bg-story-purple rounded-full opacity-40 animate-pulse [animation-delay:75ms]"></div>
          <div className="absolute inset-4 bg-story-purple rounded-full opacity-60 animate-pulse [animation-delay:150ms]"></div>
          <div className="absolute inset-6 bg-story-purple rounded-full opacity-80 animate-pulse [animation-delay:225ms]"></div>
        </div>

        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold">Your Bedtime Story</h2>
          <p className="text-muted-foreground">
            Theme: {settings.theme} • Age: {settings.ageGroup} • Duration:{" "}
            {settings.duration}min • Voice: {settings.voice}
          </p>
        </div>

        <div className="w-full bg-secondary rounded-full h-2">
          <div
            className="bg-story-purple h-2 rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {settings.music && (
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="rounded-full"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </Button>
            <Slider
              value={[volume]}
              max={1}
              step={0.1}
              onValueChange={handleVolumeChange}
              className="w-32"
            />
          </div>
        )}

        <div className="flex justify-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={onBack}
            className="rounded-full"
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
            className="rounded-full w-12 h-12 bg-story-purple hover:bg-story-purple/90"
          >
            {isPlaying ? (
              <Pause className="h-6 w-6" />
            ) : (
              <Play className="h-6 w-6 ml-1" />
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}