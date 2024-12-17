import { useEffect, useRef } from "react";
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';

interface MusicPlayerProps {
  musicUrl: string | null;
  volume: number;
  isMuted: boolean;
  onVolumeChange: (value: number[]) => void;
  onToggleMute: () => void;
}

export function MusicPlayer({
  musicUrl,
}: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playerRef = useRef<Plyr | null>(null);

  useEffect(() => {
    if (audioRef.current && !playerRef.current) {
      playerRef.current = new Plyr(audioRef.current, {
        controls: ['play', 'progress', 'current-time', 'mute', 'volume'],
        hideControls: false,
        resetOnEnd: true,
      });
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  if (!musicUrl) return null;

  return (
    <div className="space-y-4">
      <audio ref={audioRef} className="plyr-player">
        <source src={musicUrl} type="audio/mp3" />
      </audio>
    </div>
  );
}