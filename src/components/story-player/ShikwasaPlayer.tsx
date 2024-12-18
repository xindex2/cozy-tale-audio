import { useEffect, useRef } from "react";
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

// Keep track of script loading state globally
let shikwasaScriptPromise: Promise<void> | null = null;

const loadShikwasaScript = () => {
  if (!shikwasaScriptPromise) {
    shikwasaScriptPromise = new Promise((resolve, reject) => {
      // Check if script already exists
      if (document.querySelector('script[src*="shikwasa"]')) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/shikwasa@2.2.1/dist/shikwasa.min.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Shikwasa script'));
      document.head.appendChild(script);
    });
  }
  return shikwasaScriptPromise;
};

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
  const initializationAttempted = useRef(false);

  useEffect(() => {
    if (!url || !containerRef.current) {
      console.log(`No ${isMusic ? 'music' : 'voice'} URL provided`);
      return;
    }

    let mounted = true;

    const initializePlayer = async () => {
      if (initializationAttempted.current) return;
      initializationAttempted.current = true;

      try {
        await loadShikwasaScript();

        if (!mounted || !containerRef.current) return;

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
          download: false
        });

        if (playerRef.current) {
          playerRef.current.on('timeupdate', () => {
            if (playerRef.current && mounted) {
              onTimeUpdate?.(playerRef.current.audio.currentTime);
            }
          });

          playerRef.current.on('error', (e) => {
            if (mounted) {
              console.error(`${isMusic ? 'Music' : 'Voice'} audio error:`, e);
            }
          });
        }
      } catch (error) {
        console.error('Error initializing Shikwasa player:', error);
      }
    };

    initializePlayer();

    return () => {
      mounted = false;
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
      initializationAttempted.current = false;
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
