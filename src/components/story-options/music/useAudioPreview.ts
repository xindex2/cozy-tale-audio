import { useRef, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

export function useAudioPreview() {
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const { toast } = useToast();

  const handlePreview = (url: string) => {
    if (!audioRefs.current[url]) {
      const audio = new Audio(url);
      audioRefs.current[url] = audio;

      audio.addEventListener('error', () => {
        console.error(`Error loading audio for ${url}`);
        toast({
          title: "Audio Load Error",
          description: "Failed to load audio preview. Please try again.",
          variant: "destructive",
        });
      });
    }

    const audio = audioRefs.current[url];
    if (audio.paused) {
      // Stop all other playing audio first
      Object.values(audioRefs.current).forEach(a => {
        if (a !== audio && !a.paused) {
          a.pause();
          a.currentTime = 0;
        }
      });

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

  useEffect(() => {
    return () => {
      // Cleanup all audio instances
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
      audioRefs.current = {};
    };
  }, []);

  return { handlePreview };
}