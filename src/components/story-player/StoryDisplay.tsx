import { SynchronizedText } from "./SynchronizedText";
import { useRef, useState, useEffect } from "react";

interface StoryDisplayProps {
  text: string;
  audioUrl: string | null;
  isPlaying: boolean;
}

export function StoryDisplay({ text, audioUrl, isPlaying }: StoryDisplayProps) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioUrl) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.addEventListener("timeupdate", () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });
      audioRef.current.addEventListener("loadedmetadata", () => {
        setDuration(audioRef.current?.duration || 0);
      });
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [audioUrl]);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  return (
    <div className="space-y-4">
      <SynchronizedText
        text={text}
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
      />
    </div>
  );
}