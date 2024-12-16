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
    if (!voiceUrl) return;

    const audio = new Audio(voiceUrl);
    audio.volume = isMuted ? 0 : volume;
    
    audio.addEventListener('timeupdate', () => {
      onTimeUpdate?.(audio.currentTime);
    });

    audio.addEventListener('error', (e) => {
      console.error("Voice audio error:", e);
      toast({
        title: "Audio Error",
        description: "Failed to play voice audio. Please try again.",
        variant: "destructive",
      });
    });

    voiceRef.current = audio;

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', () => {});
      audio.removeEventListener('error', () => {});
    };
  }, [voiceUrl]);

  // Handle background music
  useEffect(() => {
    if (!backgroundMusicUrl) return;

    const audio = new Audio(backgroundMusicUrl);
    audio.loop = true;
    audio.volume = isMusicMuted ? 0 : musicVolume;

    audio.addEventListener('error', (e) => {
      console.error("Music error:", e);
      toast({
        title: "Music Error",
        description: "Failed to play background music. Please try again.",
        variant: "destructive",
      });
    });

    // Preload the audio
    audio.preload = "auto";
    audio.load();

    musicRef.current = audio;

    return () => {
      audio.pause();
      audio.removeEventListener('error', () => {});
    };
  }, [backgroundMusicUrl]);

  // Handle volume changes
  useEffect(() => {
    if (voiceRef.current) {
      voiceRef.current.volume = isMuted ? 0 : volume;
    }
    if (musicRef.current) {
      musicRef.current.volume = isMusicMuted ? 0 : musicVolume;
    }
  }, [volume, isMuted, musicVolume, isMusicMuted]);

  // Handle play/pause
  useEffect(() => {
    const playAudio = async (audio: HTMLAudioElement | null) => {
      if (!audio) return;
      
      try {
        if (isPlaying) {
          await audio.play();
        } else {
          audio.pause();
        }
      } catch (error) {
        console.error("Playback error:", error);
      }
    };

    playAudio(voiceRef.current);
    playAudio(musicRef.current);
  }, [isPlaying]);

  return null;
}