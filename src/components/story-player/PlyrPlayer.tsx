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
  showVolumeControl?: boolean;
}

export function PlyrPlayer({
  url,
  volume,
  isMuted,
  isPlaying,
  onTimeUpdate,
  isMusic = false,
  onError,
  showVolumeControl = true,
}: PlyrPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playerRef = useRef<Plyr | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!url || !containerRef.current) return;

    let mounted = true;

    const initializePlayer = async () => {
      try {
        if (!mounted) return;

        // Create audio element
        const audio = document.createElement('audio');
        audio.crossOrigin = "anonymous";
        audio.preload = "auto";
        
        // Add audio element to container
        containerRef.current?.appendChild(audio);
        
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
          const controls = ['play', 'progress', 'current-time'];
          if (showVolumeControl) {
            controls.push('mute', 'volume');
          }

          playerRef.current = new Plyr(audio, {
            controls,
            hideControls: false,
            resetOnEnd: true,
          });

          if (!isMusic) {
            playerRef.current.on('timeupdate', () => {
              if (mounted && audio) {
                onTimeUpdate?.(audio.currentTime);
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
  }, [url, isMusic, onTimeUpdate, onError, showVolumeControl]);

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

  return (
    <div 
      ref={containerRef}
      className="plyr-container rounded-lg overflow-hidden border border-gray-200 shadow-sm bg-white" 
    />
  );
}