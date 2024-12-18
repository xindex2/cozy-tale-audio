import { useEffect, useRef } from "react";
import "shikwasa";
import "shikwasa/dist/style.css";

interface ShikwasaPlayerProps {
  url: string;
  volume: number;
  isMuted: boolean;
  isPlaying: boolean;
  onTimeUpdate?: (time: number) => void;
  isMusic?: boolean;
  text?: string;
}

// Add type declaration for Shikwasa
declare global {
  class Shikwasa {
    constructor(config: {
      container: HTMLElement;
      audio: {
        title: string;
        artist: string;
        cover: string;
        src: string;
        lyrics?: { text: string }[];
      };
      fixed: {
        type: string;
      };
      themeColor: string;
      autoplay: boolean;
      muted: boolean;
      volume: number;
      download: boolean;
    });
    on(event: string, callback: (...args: any[]) => void): void;
    play(): Promise<void>;
    pause(): void;
    destroy(): void;
    volume: number;
    audio: {
      currentTime: number;
    };
  }
}

export function ShikwasaPlayer({
  url,
  volume,
  isMuted,
  isPlaying,
  onTimeUpdate,
  isMusic = false,
  text,
}: ShikwasaPlayerProps) {
  const playerRef = useRef<Shikwasa | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!url || !containerRef.current) {
      console.log(`No ${isMusic ? 'music' : 'voice'} URL provided`);
      return;
    }

    // Initialize Shikwasa player
    playerRef.current = new Shikwasa({
      container: containerRef.current,
      audio: {
        title: isMusic ? "Background Music" : "Story Narration",
        artist: isMusic ? "Background" : "Narrator",
        cover: "/placeholder.svg",
        src: url,
        lyrics: text ? [{ text }] : undefined
      },
      fixed: {
        type: 'static'
      },
      themeColor: '#60A5FA',
      autoplay: false,
      muted: isMuted,
      volume: volume,
      download: false,
    });

    // Add event listeners
    if (playerRef.current) {
      playerRef.current.on('timeupdate', () => {
        if (playerRef.current) {
          onTimeUpdate?.(playerRef.current.audio.currentTime);
        }
      });

      playerRef.current.on('error', (e) => {
        console.error(`${isMusic ? 'Music' : 'Voice'} audio error:`, e);
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [url, isMusic, onTimeUpdate, text]);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.play().catch(console.error);
      } else {
        playerRef.current.pause();
      }
    }
  }, [isPlaying]);

  return <div ref={containerRef} className="shikwasa-container" />;
}