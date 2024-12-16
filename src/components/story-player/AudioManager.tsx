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

    const audio = new Audio();
    
    // Set CORS headers for ElevenLabs audio
    audio.crossOrigin = "anonymous";
    
    // Add event listeners before setting the source
    audio.addEventListener('error', (e) => {
      console.error("Voice audio error:", e);
      toast({
        title: "Audio Error",
        description: "Failed to play voice audio. Please try again.",
        variant: "destructive",
      });
    });

    audio.addEventListener('timeupdate', () => {
      onTimeUpdate?.(audio.currentTime);
    });

    audio.addEventListener('canplaythrough', () => {
      console.log("Voice audio loaded and ready to play");
      if (isPlaying) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Error playing voice audio:", error);
          });
        }
      }
    });

    // Set audio properties
    audio.volume = isMuted ? 0 : volume;
    audio.src = voiceUrl;
    audio.load(); // Explicitly load the audio
    
    voiceRef.current = audio;

    return () => {
      audio.pause();
      audio.src = ""; // Clear the source
      audio.removeEventListener('timeupdate', () => {});
      audio.removeEventListener('error', () => {});
      audio.removeEventListener('canplaythrough', () => {});
    };
  }, [voiceUrl]);

  // Handle background music
  useEffect(() => {
    if (!backgroundMusicUrl) return;

    const audio = new Audio();
    audio.loop = true;
    audio.volume = isMusicMuted ? 0 : musicVolume;
    audio.crossOrigin = "anonymous";

    audio.addEventListener('error', (e) => {
      console.error("Music error:", e);
      toast({
        title: "Music Error",
        description: "Failed to play background music. Please try again.",
        variant: "destructive",
      });
    });

    audio.addEventListener('canplaythrough', () => {
      console.log("Music loaded and ready to play");
      if (isPlaying) {
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.error("Error playing background music:", error);
          });
        }
      }
    });

    audio.src = backgroundMusicUrl;
    audio.load(); // Explicitly load the audio
    
    musicRef.current = audio;

    return () => {
      audio.pause();
      audio.src = ""; // Clear the source
      audio.removeEventListener('error', () => {});
      audio.removeEventListener('canplaythrough', () => {});
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
          const playPromise = audio.play();
          if (playPromise !== undefined) {
            await playPromise;
          }
        } else {
          audio.pause();
        }
      } catch (error) {
        console.error("Playback error:", error);
        toast({
          title: "Playback Error",
          description: "Failed to play audio. Please try again.",
          variant: "destructive",
        });
      }
    };

    playAudio(voiceRef.current);
    playAudio(musicRef.current);
  }, [isPlaying]);

  return null;
}