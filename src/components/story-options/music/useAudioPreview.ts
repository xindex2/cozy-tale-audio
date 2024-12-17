import { useRef, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

export function useAudioPreview(url: string) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const audio = new Audio(url);
    audioRef.current = audio;

    audio.addEventListener('error', () => {
      console.error(`Error loading audio for ${url}`);
      toast({
        title: "Audio Load Error",
        description: "Failed to load audio preview. Please try again.",
        variant: "destructive",
      });
    });

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, [url]);

  const handlePreview = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play().catch(error => {
        console.error("Error playing audio:", error);
        toast({
          title: "Playback Error",
          description: "Failed to play audio preview. Please try again.",
          variant: "destructive",
        });
      });
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  return { handlePreview };
}