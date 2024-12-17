import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

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
  const voicePlayerRef = useRef<Plyr | null>(null);
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const musicPlayerRef = useRef<Plyr | null>(null);
  const { toast } = useToast();

  // Initialize Plyr for voice audio
  useEffect(() => {
    if (!voiceUrl) {
      console.log("No voice URL provided");
      return;
    }

    console.log("Setting up voice audio with URL:", voiceUrl);
    const audio = new Audio(voiceUrl);
    audio.preload = "auto";
    voiceRef.current = audio;

    // Initialize Plyr for voice
    if (!voicePlayerRef.current) {
      voicePlayerRef.current = new Plyr(audio, {
        controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume'],
        hideControls: false,
        resetOnEnd: true,
      });

      // Apply custom styling
      document.documentElement.style.setProperty('--plyr-color-main', '#818CF8');
      document.documentElement.style.setProperty('--plyr-range-fill-background', '#818CF8');
    }
    
    const handleError = (e: Event) => {
      console.error("Voice audio error:", e);
      toast({
        title: "Audio Error",
        description: "Failed to load voice audio. Please try again.",
        variant: "destructive",
      });
    };

    const handleTimeUpdate = () => {
      onTimeUpdate?.(audio.currentTime);
    };

    audio.addEventListener('error', handleError);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    
    audio.volume = isMuted ? 0 : volume;

    if (isPlaying) {
      audio.play().catch(error => {
        console.error("Error playing voice audio:", error);
      });
    }

    return () => {
      audio.pause();
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      if (voicePlayerRef.current) {
        voicePlayerRef.current.destroy();
        voicePlayerRef.current = null;
      }
      voiceRef.current = null;
    };
  }, [voiceUrl, toast, onTimeUpdate]);

  // Initialize Plyr for background music
  useEffect(() => {
    if (!backgroundMusicUrl) {
      console.log("No background music URL provided");
      return;
    }

    console.log("Setting up background music with URL:", backgroundMusicUrl);
    const audio = new Audio(backgroundMusicUrl);
    audio.preload = "auto";
    audio.loop = true;
    musicRef.current = audio;

    // Initialize Plyr for music
    if (!musicPlayerRef.current) {
      musicPlayerRef.current = new Plyr(audio, {
        controls: ['play', 'progress', 'current-time', 'mute', 'volume'],
        hideControls: false,
        resetOnEnd: true,
      });
    }
    
    const handleError = (e: Event) => {
      console.error("Music error:", e);
      toast({
        title: "Music Error",
        description: "Failed to load background music. Please try again.",
        variant: "destructive",
      });
    };

    audio.addEventListener('error', handleError);
    audio.volume = isMusicMuted ? 0 : musicVolume;

    if (isPlaying) {
      audio.play().catch(error => {
        console.error("Error playing background music:", error);
      });
    }

    return () => {
      audio.pause();
      audio.removeEventListener('error', handleError);
      if (musicPlayerRef.current) {
        musicPlayerRef.current.destroy();
        musicPlayerRef.current = null;
      }
      musicRef.current = null;
    };
  }, [backgroundMusicUrl, isPlaying, musicVolume, isMusicMuted]);

  // Handle play/pause
  useEffect(() => {
    if (isPlaying) {
      voiceRef.current?.play().catch(console.error);
      musicRef.current?.play().catch(console.error);
    } else {
      voiceRef.current?.pause();
      musicRef.current?.pause();
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