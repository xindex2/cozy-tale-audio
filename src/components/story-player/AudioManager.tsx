import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface AudioManagerProps {
  voiceUrl: string | null;
  backgroundMusicUrl: string | null;
  isPlaying: boolean;
  volume: number;
  isMuted: boolean;
  musicVolume: number;
  isMusicMuted: boolean;
  onTimeUpdate?: (time: number) => void;
}

export function AudioManager({ 
  voiceUrl, 
  backgroundMusicUrl, 
  isPlaying, 
  volume,
  isMuted,
  musicVolume,
  isMusicMuted,
  onTimeUpdate 
}: AudioManagerProps) {
  const voiceRef = useRef<HTMLAudioElement | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  // Handle voice audio
  useEffect(() => {
    if (!voiceUrl) {
      console.log("No voice URL provided");
      return;
    }

    console.log("Setting up voice audio with URL:", voiceUrl);
    const audio = new Audio(voiceUrl);
    audio.preload = "auto";
    
    const handleError = (e: Event) => {
      console.error("Voice audio error:", e);
      toast({
        title: "Audio Error",
        description: "Failed to load voice audio. Please try again.",
        variant: "destructive",
      });
    };

    const handleCanPlay = () => {
      console.log("Voice audio ready to play");
      if (isPlaying) {
        audio.play().catch(error => {
          console.error("Error playing voice audio:", error);
        });
      }
    };

    const handleTimeUpdate = () => {
      onTimeUpdate?.(audio.currentTime);
    };

    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    
    voiceRef.current = audio;
    audio.volume = isMuted ? 0 : volume;

    return () => {
      audio.pause();
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      voiceRef.current = null;
    };
  }, [voiceUrl, toast, onTimeUpdate]);

  // Handle background music
  useEffect(() => {
    if (!backgroundMusicUrl) {
      console.log("No background music URL provided");
      return;
    }

    console.log("Setting up background music with URL:", backgroundMusicUrl);
    const audio = new Audio(backgroundMusicUrl);
    audio.preload = "auto";
    audio.loop = true;
    
    const handleError = (e: Event) => {
      console.error("Music error:", e);
      toast({
        title: "Music Error",
        description: "Failed to load background music. Please try again.",
        variant: "destructive",
      });
    };

    const handleCanPlay = () => {
      console.log("Background music ready to play");
      if (isPlaying) {
        audio.play().catch(error => {
          console.error("Error playing background music:", error);
        });
      }
    };

    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);
    musicRef.current = audio;
    audio.volume = isMusicMuted ? 0 : musicVolume;

    return () => {
      audio.pause();
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
      musicRef.current = null;
    };
  }, [backgroundMusicUrl, isPlaying, musicVolume, isMusicMuted]);

  // Handle play/pause
  useEffect(() => {
    if (isPlaying) {
      if (voiceRef.current) {
        voiceRef.current.play().catch(console.error);
      }
      if (musicRef.current) {
        musicRef.current.play().catch(console.error);
      }
    } else {
      if (voiceRef.current) {
        voiceRef.current.pause();
      }
      if (musicRef.current) {
        musicRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Handle volume changes
  useEffect(() => {
    if (voiceRef.current) {
      voiceRef.current.volume = isMuted ? 0 : volume;
    }
    if (musicRef.current) {
      musicRef.current.volume = isMusicMuted ? 0 : musicVolume;
    }
  }, [volume, isMuted, musicVolume, isMusicMuted]);

  return null;
}