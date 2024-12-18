import { useToast } from "@/hooks/use-toast";
import { PlyrPlayer } from "./PlyrPlayer";

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
  const { toast } = useToast();

  const handleError = (type: 'voice' | 'music') => {
    toast({
      title: "Audio Error",
      description: `Failed to load ${type} audio. Please try again.`,
      variant: "destructive",
    });
  };

  return (
    <div className="hidden">
      {voiceUrl && (
        <PlyrPlayer
          url={voiceUrl}
          volume={volume}
          isMuted={isMuted}
          isPlaying={isPlaying}
          onTimeUpdate={onTimeUpdate}
          onError={() => handleError('voice')}
        />
      )}
      {backgroundMusicUrl && (
        <PlyrPlayer
          url={backgroundMusicUrl}
          volume={musicVolume}
          isMuted={isMusicMuted}
          isPlaying={isPlaying}
          isMusic={true}
          onError={() => handleError('music')}
        />
      )}
    </div>
  );
}