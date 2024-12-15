import { useRef, useEffect, useState } from "react";
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
  const [height, setHeight] = useState<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const updateHeight = () => {
      if (container && container.offsetParent !== null) {
        const viewportHeight = window.innerHeight;
        const maxHeight = Math.floor(viewportHeight * 0.6); // 60vh
        setHeight(maxHeight);
      }
    };

    const debouncedResize = debounce(updateHeight, 100);
    updateHeight(); // Initial height

    window.addEventListener('resize', debouncedResize);

    return () => {
      window.removeEventListener('resize', debouncedResize);
      debouncedResize.cancel();
    };
  }, []);
  
  const sentences = text.split(". ").map(s => s.trim() + ".");
  const sentencesPerSecond = duration > 0 ? sentences.length / duration : 0;
  const currentSentenceIndex = Math.floor(currentTime * sentencesPerSecond);

  return (
    <div 
      ref={containerRef}
      style={{ maxHeight: height ? `${height}px` : '60vh' }}
      className="prose prose-lg max-w-none space-y-4 p-6 bg-white/90 rounded-lg shadow-sm overflow-auto scroll-smooth"
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