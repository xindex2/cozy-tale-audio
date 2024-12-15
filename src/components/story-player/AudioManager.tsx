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
    const setupVoice = async () => {
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
          
          voiceRef.current = audio;
          
          if (isPlaying) {
            try {
              await audio.play();
            } catch (error) {
              console.error("Error playing voice audio:", error);
              toast({
                title: "Voice Audio Error",
                description: "Failed to play voice audio. Please try again.",
                variant: "destructive",
              });
            }
          }
        } catch (error) {
          console.error("Error setting up voice audio:", error);
        }
      }
    };

    setupVoice();
  }, [voiceUrl]);

  // Handle background music
  useEffect(() => {
    const setupMusic = async () => {
      if (backgroundMusicUrl) {
        try {
          if (musicRef.current) {
            musicRef.current.pause();
          }

          const audio = new Audio(backgroundMusicUrl);
          audio.loop = true;
          audio.volume = isMusicMuted ? 0 : musicVolume;
          
          // Wait for the audio to be loaded
          await new Promise((resolve) => {
            audio.addEventListener('canplaythrough', resolve, { once: true });
            audio.addEventListener('error', (e) => {
              console.error("Music loading error:", e);
              resolve(null);
            }, { once: true });
          });
          
          musicRef.current = audio;
          
          if (isPlaying) {
            try {
              const playPromise = audio.play();
              if (playPromise) {
                await playPromise;
              }
            } catch (error) {
              console.error("Error playing background music:", error);
              toast({
                title: "Music Error",
                description: "Failed to play background music. Please check your internet connection.",
                variant: "destructive",
              });
            }
          }
        } catch (error) {
          console.error("Error setting up background music:", error);
        }
      }
    };

    setupMusic();
  }, [backgroundMusicUrl]);

  // Cleanup
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
    const handlePlayback = async () => {
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
      
      if (musicRef.current) {
        try {
          if (isPlaying) {
            const playPromise = musicRef.current.play();
            if (playPromise) {
              await playPromise;
            }
          } else {
            musicRef.current.pause();
          }
        } catch (error) {
          console.error("Error controlling music playback:", error);
        }
      }
    };

    handlePlayback();
  }, [isPlaying]);

  return null;
}