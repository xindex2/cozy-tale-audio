import { useRef } from "react";
import { useContainerHeight } from "@/hooks/useContainerHeight";
import { StoryText } from "./StoryText";

interface StoryDisplayProps {
  text: string | undefined;
  audioUrl: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

export function StoryDisplay({ 
  text = "", // Provide default empty string
  audioUrl, 
  isPlaying, 
  currentTime, 
  duration 
}: StoryDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const height = useContainerHeight(containerRef);
  
  // Only split text if it exists
  const sentences = text?.split(". ").filter(s => s.trim()).map(s => 
    s.endsWith(".") ? s : s + "."
  ) || [];
  
  const sentencesPerSecond = duration > 0 ? sentences.length / duration : 0;
  const currentSentenceIndex = Math.floor(currentTime * sentencesPerSecond);

  return (
    <div 
      ref={containerRef}
      style={{ height: height ? `${height}px` : 'auto', minHeight: '50vh' }}
      className="prose prose-lg max-w-none space-y-4 p-6 bg-white/90 rounded-lg shadow-sm overflow-auto scroll-smooth"
    >
      {text ? (
        <StoryText 
          sentences={sentences}
          currentSentenceIndex={currentSentenceIndex}
        />
      ) : (
        <p className="text-gray-500 italic">Story text will appear here...</p>
      )}
    </div>
  );
}