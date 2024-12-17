import { MusicPlayer } from "./MusicPlayer";

interface MusicControlsProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (value: number[]) => void;
  onToggleMute: () => void;
  selectedMusic?: string;
  onMusicChange?: (value: string) => void;
}

export function MusicControls({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
  selectedMusic,
}: MusicControlsProps) {
  const getMusicUrl = (musicKey: string): string | null => {
    const musicMap: Record<string, string> = {
      'sleeping-lullaby': '/assets/gentle-lullaby.mp3',
      'water-dreams': '/assets/ocean-waves.mp3',
      'forest-birds': '/assets/nature-sounds.mp3',
      'relaxing-piano': '/assets/soft-piano.mp3',
      'gentle-dreams': '/assets/peaceful-dreams.mp3',
    };

    return musicMap[musicKey] || null;
  };

  const musicUrl = selectedMusic ? getMusicUrl(selectedMusic) : null;

  return (
    <MusicPlayer
      musicUrl={musicUrl}
      volume={volume}
      isMuted={isMuted}
      onVolumeChange={onVolumeChange}
      onToggleMute={onToggleMute}
    />
  );
}