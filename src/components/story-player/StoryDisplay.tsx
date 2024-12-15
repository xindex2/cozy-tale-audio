import { useRef } from "react";
import { useContainerHeight } from "@/hooks/useContainerHeight";
import { StoryText } from "./StoryText";

interface StoryDisplayProps {
  text: string;
  audioUrl: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
}

export function StoryDisplay({ 
  text, 
  audioUrl, 
  isPlaying, 
  currentTime, 
  duration 
}: StoryDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const height = useContainerHeight(containerRef);
  
  const sentences = text.split(". ").map(s => s.trim() + ".");
  const sentencesPerSecond = duration > 0 ? sentences.length / duration : 0;
  const currentSentenceIndex = Math.floor(currentTime * sentencesPerSecond);

  return (
    <div 
      ref={containerRef}
      style={{ height: height ? `${height}px` : '60vh' }}
      className="prose prose-lg max-w-none space-y-4 p-6 bg-white/90 rounded-lg shadow-sm overflow-auto scroll-smooth"
    >
      <StoryText 
        sentences={sentences}
        currentSentenceIndex={currentSentenceIndex}
      />
    </div>
  );
}