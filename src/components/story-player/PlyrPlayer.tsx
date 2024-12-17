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
}

export function PlyrPlayer({
  url,
  volume,
  isMuted,
  isPlaying,
  onTimeUpdate,
  isMusic = false,
}: PlyrPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playerRef = useRef<Plyr | null>(null);

  useEffect(() => {
    if (!url) {
      console.log(`No ${isMusic ? 'music' : 'voice'} URL provided`);
      return;
    }

    const audio = new Audio(url);
    audio.preload = "auto";
    if (isMusic) {
      audio.loop = true;
    }
    audioRef.current = audio;

    if (!playerRef.current) {
      playerRef.current = new Plyr(audio, {
        controls: isMusic 
          ? ['play', 'progress', 'current-time', 'mute', 'volume']
          : ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume'],
        hideControls: false,
        resetOnEnd: true,
      });

      // Apply custom styling
      document.documentElement.style.setProperty('--plyr-color-main', '#60A5FA');
      document.documentElement.style.setProperty('--plyr-range-fill-background', '#60A5FA');
      document.documentElement.style.setProperty('--plyr-audio-controls-background', '#1e293b');
      document.documentElement.style.setProperty('--plyr-audio-control-color', '#ffffff');
      document.documentElement.style.setProperty('--plyr-audio-control-color-hover', '#60A5FA');
    }

    const handleError = (e: Event) => {
      console.error(`${isMusic ? 'Music' : 'Voice'} audio error:`, e);
    };

    const handleTimeUpdate = () => {
      onTimeUpdate?.(audio.currentTime);
    };

    audio.addEventListener('error', handleError);
    if (!isMusic) {
      audio.addEventListener('timeupdate', handleTimeUpdate);
    }

    return () => {
      audio.pause();
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
  }, [url, isMusic, onTimeUpdate]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(console.error);
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying]);

  return null;
}