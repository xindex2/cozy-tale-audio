import { useEffect, useRef } from "react";
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

interface PlyrPlayerProps {
  url: string;
  volume: number;
  isMuted: boolean;
  isPlaying: boolean;
  onTimeUpdate?: (time: number) => void;
  isMusic?: boolean;
  onError?: () => void;
}

export function PlyrPlayer({
  url,
  volume,
  isMuted,
  isPlaying,
  onTimeUpdate,
  isMusic = false,
  onError,
}: PlyrPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playerRef = useRef<Plyr | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!url) {
      console.log(`No ${isMusic ? 'music' : 'voice'} URL provided`);
      return;
    }

    // Create audio element
    const audio = document.createElement('audio');
    audio.src = url;
    audio.preload = "auto";
    if (isMusic) {
      audio.loop = true;
    }

    // Ensure container exists
    if (!containerRef.current) return;

    // Clear container
    containerRef.current.innerHTML = '';
    
    // Append audio to container
    containerRef.current.appendChild(audio);
    audioRef.current = audio;

    // Initialize Plyr
    if (audioRef.current) {
      playerRef.current = new Plyr(audioRef.current, {
        controls: [],
        hideControls: false,
        resetOnEnd: true,
      });

      // Load metadata to get duration
      audio.addEventListener('loadedmetadata', () => {
        console.log(`${isMusic ? 'Music' : 'Voice'} duration:`, audio.duration);
      });

      const handleError = (e: Event) => {
        console.error(`${isMusic ? 'Music' : 'Voice'} audio error:`, e);
        onError?.();
      };

      const handleTimeUpdate = () => {
        if (audioRef.current) {
          onTimeUpdate?.(audioRef.current.currentTime);
        }
      };

      audio.addEventListener('error', handleError);
      if (!isMusic) {
        audio.addEventListener('timeupdate', handleTimeUpdate);
      }

      return () => {
        audio.removeEventListener('error', handleError);
        if (!isMusic) {
          audio.removeEventListener('timeupdate', handleTimeUpdate);
        }
        if (playerRef.current) {
          playerRef.current.destroy();
          playerRef.current = null;
        }
        audioRef.current = null;
      };
    }
  }, [url, isMusic, onTimeUpdate, onError]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(error => {
        console.error("Error playing audio:", error);
        onError?.();
      });
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, onError]);

  return <div ref={containerRef} className="plyr-container" />;
}