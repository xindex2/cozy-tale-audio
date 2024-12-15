import { useRef, useState, useEffect } from "react";
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
  const words = text.split(" ");
  const wordsPerSecond = duration > 0 ? words.length / duration : 0;
  const currentWordIndex = Math.floor(currentTime * wordsPerSecond);

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
      {text.split(". ").map((sentence, index) => (
        <p key={index} className="text-gray-800 leading-relaxed">
          {sentence.split(" ").map((word, wordIndex) => {
            const globalWordIndex = words.slice(0, index).length + wordIndex;
            return (
              <span
                key={wordIndex}
                className={`transition-all duration-200 ${
                  globalWordIndex <= currentWordIndex 
                    ? "text-blue-600 font-semibold" 
                    : ""
                }`}
              >
                {word}{" "}
              </span>
            );
          })}
          {index < text.split(". ").length - 1 ? ". " : ""}
        </p>
      ))}
    </div>
  );
}