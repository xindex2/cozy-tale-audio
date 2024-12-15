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

  useEffect(() => {
    const setupAudio = async () => {
      if (voiceUrl) {
        try {
          if (voiceRef.current) {
            voiceRef.current.pause();
          }
          const audio = new Audio(voiceUrl);
          audio.volume = isMuted ? 0 : volume;
          
          audio.ontimeupdate = () => {
            onTimeUpdate?.(audio.currentTime);
          };
          
          if (isPlaying) {
            await audio.play();
          }
          
          voiceRef.current = audio;
        } catch (error) {
          console.error("Error playing voice audio:", error);
          toast({
            title: "Audio Error",
            description: "Failed to play voice audio. Please try again.",
            variant: "destructive",
          });
        }
      }
    };

    setupAudio();
  }, [voiceUrl, volume, isMuted, isPlaying]);

  useEffect(() => {
    const setupMusic = async () => {
      if (backgroundMusicUrl) {
        try {
          if (musicRef.current) {
            musicRef.current.pause();
            musicRef.current = null;
          }

          const audio = new Audio(backgroundMusicUrl);
          audio.loop = true;
          audio.volume = isMusicMuted ? 0 : musicVolume;
          
          // Preload the audio
          audio.preload = "auto";
          
          // Wait for the audio to be loaded before playing
          await new Promise((resolve, reject) => {
            audio.oncanplaythrough = resolve;
            audio.onerror = reject;
          });
          
          if (isPlaying) {
            await audio.play();
          }
          
          musicRef.current = audio;
        } catch (error) {
          console.error("Error playing background music:", error);
          toast({
            title: "Music Error",
            description: "Failed to play background music. Will continue without it.",
            variant: "destructive",
          });
        }
      }
    };

    setupMusic();
  }, [backgroundMusicUrl, musicVolume, isMusicMuted, isPlaying]);

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

  useEffect(() => {
    if (voiceRef.current) {
      voiceRef.current.volume = isMuted ? 0 : volume;
    }
    if (musicRef.current) {
      musicRef.current.volume = isMusicMuted ? 0 : musicVolume;
    }
  }, [volume, isMuted, musicVolume, isMusicMuted]);

  useEffect(() => {
    const handleVoice = async () => {
      if (voiceRef.current) {
        try {
          if (isPlaying) {
            await voiceRef.current.play();
          } else {
            voiceRef.current.pause();
          }
        } catch (error) {
          console.error("Error controlling voice playback:", error);
        }
      }
    };

    const handleMusic = async () => {
      if (musicRef.current) {
        try {
          if (isPlaying) {
            await musicRef.current.play();
          } else {
            musicRef.current.pause();
          }
        } catch (error) {
          console.error("Error controlling music playback:", error);
        }
      }
    };

    handleVoice();
    handleMusic();
  }, [isPlaying]);

  return null;
}