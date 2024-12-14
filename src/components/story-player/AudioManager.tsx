import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface AudioManagerProps {
  voiceUrl: string | null;
  backgroundMusicUrl: string | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
}

export function AudioManager({ voiceUrl, backgroundMusicUrl, isPlaying, volume, isMuted }: AudioManagerProps) {
  const voiceRef = useRef<HTMLAudioElement | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (voiceUrl) {
      if (voiceRef.current) {
        voiceRef.current.pause();
      }
      voiceRef.current = new Audio(voiceUrl);
      voiceRef.current.volume = isMuted ? 0 : volume;
      
      if (isPlaying) {
        voiceRef.current.play().catch(error => {
          console.error("Error playing voice audio:", error);
          toast({
            title: "Audio Error",
            description: "Failed to play voice audio. Please try again.",
            variant: "destructive",
          });
        });
      }
    }
  }, [voiceUrl, volume, isMuted, isPlaying]);

  useEffect(() => {
    if (backgroundMusicUrl) {
      if (musicRef.current) {
        musicRef.current.pause();
      }
      musicRef.current = new Audio(backgroundMusicUrl);
      musicRef.current.loop = true;
      musicRef.current.volume = isMuted ? 0 : volume * 0.3; // Lower volume for background music
      
      if (isPlaying) {
        musicRef.current.play().catch(error => {
          console.error("Error playing background music:", error);
          toast({
            title: "Audio Error",
            description: "Failed to play background music. Please try again.",
            variant: "destructive",
          });
        });
      }
    }
  }, [backgroundMusicUrl, volume, isMuted, isPlaying]);

  useEffect(() => {
    return () => {
      if (voiceRef.current) {
        voiceRef.current.pause();
      }
      if (musicRef.current) {
        musicRef.current.pause();
      }
    };
  }, []);

  return null;
}