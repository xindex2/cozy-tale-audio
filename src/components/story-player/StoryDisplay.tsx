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
    const container = containerRef.current;
    if (!container) return;

    const debouncedResize = debounce(() => {
      // Only observe size changes when the element is in the viewport
      if (container.offsetParent !== null) {
        const { scrollHeight, clientHeight } = container;
        if (scrollHeight > clientHeight) {
          container.scrollTop = scrollHeight - clientHeight;
        }
      }
    }, 100);

    try {
      observerRef.current = new ResizeObserver((entries) => {
        // Check if the element is still in the DOM before processing
        if (container.isConnected) {
          debouncedResize();
        }
      });

      observerRef.current.observe(container);
    } catch (error) {
      console.warn('ResizeObserver error handled:', error);
    }

    return () => {
      debouncedResize.cancel();
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);
  
  return (
    <div 
      ref={containerRef}
      className="prose prose-lg max-w-none space-y-4 p-6 bg-white/90 rounded-lg shadow-sm overflow-auto max-h-[60vh]"
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