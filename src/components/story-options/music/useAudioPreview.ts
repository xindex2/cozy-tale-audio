import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export function useAudioPreview(previewVolume: number) {
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const stopPreview = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    setPlayingId(null);
  };

  const togglePreview = async (musicId: string, url: string) => {
    try {
      if (playingId === musicId) {
        stopPreview();
        return;
      }

      stopPreview();

      const audio = new Audio();
      
      // Set up event listeners before setting src
      audio.addEventListener('error', (e) => {
        console.error('Audio preview error:', e);
        toast({
          title: "Error",
          description: "Failed to play audio preview. Please try again.",
          variant: "destructive",
        });
        stopPreview();
      });

      audio.addEventListener('ended', stopPreview);

      // Set volume and source
      audio.volume = previewVolume;
      audio.src = url;

      // Wait for audio to be loaded before playing
      await new Promise((resolve, reject) => {
        audio.addEventListener('canplaythrough', resolve, { once: true });
        audio.addEventListener('error', reject, { once: true });
        audio.load();
      });

      await audio.play();
      audioRef.current = audio;
      setPlayingId(musicId);

    } catch (error) {
      console.error('Error in togglePreview:', error);
      toast({
        title: "Error",
        description: "An error occurred while trying to play the preview.",
        variant: "destructive",
      });
      stopPreview();
    }
  };

  useEffect(() => {
    return () => {
      stopPreview();
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = previewVolume;
    }
  }, [previewVolume]);

  return {
    playingId,
    togglePreview,
    stopPreview
  };
}