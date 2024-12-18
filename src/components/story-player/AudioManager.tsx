import { useToast } from "@/hooks/use-toast";
import { PlyrPlayer } from "./PlyrPlayer";
import { useEffect, useState } from "react";

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
  const [isVoiceReady, setIsVoiceReady] = useState(false);
  const [isMusicReady, setIsMusicReady] = useState(false);

  useEffect(() => {
    if (voiceUrl) {
      const audio = new Audio(voiceUrl);
      audio.addEventListener('canplay', () => setIsVoiceReady(true));
      audio.addEventListener('error', () => {
        toast({
          title: "Error",
          description: "Failed to load voice audio. Please try again.",
          variant: "destructive",
        });
      });
      return () => audio.remove();
    }
  }, [voiceUrl, toast]);

  useEffect(() => {
    if (backgroundMusicUrl) {
      const audio = new Audio(backgroundMusicUrl);
      audio.addEventListener('canplay', () => setIsMusicReady(true));
      audio.addEventListener('error', () => {
        toast({
          title: "Error",
          description: "Failed to load background music. Please try again.",
          variant: "destructive",
        });
      });
      return () => audio.remove();
    }
  }, [backgroundMusicUrl, toast]);

  return (
    <div className="hidden">
      {voiceUrl && isVoiceReady && (
        <PlyrPlayer
          url={voiceUrl}
          volume={volume}
          isMuted={isMuted}
          isPlaying={isPlaying}
          onTimeUpdate={onTimeUpdate}
          onError={() => {
            toast({
              title: "Error",
              description: "Failed to play voice audio. Please try again.",
              variant: "destructive",
            });
          }}
        />
      )}
      {backgroundMusicUrl && isMusicReady && (
        <PlyrPlayer
          url={backgroundMusicUrl}
          volume={musicVolume}
          isMuted={isMusicMuted}
          isPlaying={isPlaying}
          isMusic={true}
          onError={() => {
            toast({
              title: "Error",
              description: "Failed to play background music. Please try again.",
              variant: "destructive",
            });
          }}
        />
      )}
    </div>
  );
}