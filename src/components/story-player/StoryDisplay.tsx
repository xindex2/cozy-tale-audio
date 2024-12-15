import { useRef, useEffect } from "react";
import { debounce } from "lodash";

interface StoryDisplayProps {
  text: string;
  audioUrl: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

export function StoryDisplay({ text, audioUrl, isPlaying, currentTime, duration }: StoryDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<ResizeObserver | null>(null);
  const sentences = text.split(". ").map(s => s.trim() + ".");
  const sentencesPerSecond = duration > 0 ? sentences.length / duration : 0;
  const currentSentenceIndex = Math.floor(currentTime * sentencesPerSecond);

  useEffect(() => {
    if (!containerRef.current) return;

    const debouncedResize = debounce(() => {
      // Handle resize if needed
    }, 100);

    observerRef.current = new ResizeObserver(debouncedResize);
    observerRef.current.observe(containerRef.current);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      debouncedResize.cancel();
    };
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className="prose prose-lg max-w-none space-y-4 p-6 bg-white/90 rounded-lg shadow-sm overflow-auto"
    >
      {sentences.map((sentence, index) => (
        <p 
          key={index} 
          className={`text-gray-800 leading-relaxed transition-all duration-300 ${
            index === currentSentenceIndex 
              ? "bg-blue-100 font-semibold" 
              : index < currentSentenceIndex
              ? "text-gray-500"
              : ""
          }`}
        >
          {sentence}
        </p>
      ))}
    </div>
  );
}
