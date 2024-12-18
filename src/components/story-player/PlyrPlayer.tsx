import { useEffect, useRef, useState } from "react";
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!url) {
      console.log(`No ${isMusic ? 'music' : 'voice'} URL provided`);
      return;
    }

    let mounted = true;

    const initializePlayer = async () => {
      try {
        if (!mounted) return;

        const audio = document.createElement('audio');
        audio.crossOrigin = "anonymous";
        audio.preload = "auto";
        
        audio.addEventListener('canplay', () => {
          if (mounted) setIsLoading(false);
        });

        audio.addEventListener('error', (e) => {
          console.error(`${isMusic ? 'Music' : 'Voice'} audio error:`, e);
          if (mounted) {
            setIsLoading(false);
            onError?.();
          }
        });

        audio.src = url;
        
        if (isMusic) {
          audio.loop = true;
        }

        if (mounted) {
          playerRef.current = new Plyr(audio, {
            controls: ['play', 'progress', 'current-time', 'mute', 'volume'],
            hideControls: false,
            resetOnEnd: true,
          });

          if (!isMusic) {
            playerRef.current.on('timeupdate', () => {
              if (mounted && audioRef.current) {
                onTimeUpdate?.(audioRef.current.currentTime);
              }
            });
          }

          audioRef.current = audio;
        }
      } catch (error) {
        console.error('Error initializing Plyr player:', error);
        if (mounted) {
          setIsLoading(false);
          onError?.();
        }
      }
    };

    initializePlayer();

    return () => {
      mounted = false;
      if (playerRef.current) {
        playerRef.current.destroy();
      }
      if (audioRef.current) {
        audioRef.current.remove();
      }
    };
  }, [url, isMusic, onTimeUpdate, onError]);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (!isLoading && playerRef.current) {
      const handlePlay = async () => {
        try {
          await playerRef.current?.play();
        } catch (error) {
          console.error("Error playing audio:", error);
          onError?.();
        }
      };

      if (isPlaying) {
        handlePlay();
      } else {
        playerRef.current.pause();
      }
    }
  }, [isPlaying, isLoading, onError]);

  if (isLoading) {
    return null;
  }

  return <div className="plyr-container" />;
}