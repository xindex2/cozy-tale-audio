import { useRef, useEffect } from "react";
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
  text = "", 
  audioUrl, 
  isPlaying, 
  currentTime, 
  duration 
}: StoryDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const height = useContainerHeight(containerRef);
  
  // Split text into natural phrases using spaces and line breaks
  const phrases = text?.split(/\n+/).flatMap(paragraph => 
    paragraph.split(/(?<=[.!?])\s+/).filter(phrase => phrase.trim().length > 0)
  ) || [];
  
  // Calculate the time per phrase based on total duration
  const timePerPhrase = duration > 0 ? duration / phrases.length : 0;
  const currentPhraseIndex = Math.floor(currentTime / timePerPhrase);

  return (
    <div 
      ref={containerRef}
      style={{ height: height ? `${height}px` : 'auto', minHeight: '50vh' }}
      className="prose prose-lg max-w-none space-y-4 p-6 bg-white/90 rounded-lg shadow-sm overflow-auto scroll-smooth"
    >
      {text ? (
        <StoryText 
          phrases={phrases}
          currentPhraseIndex={currentPhraseIndex}
        />
      ) : (
        <p className="text-gray-500 italic">Story text will appear here...</p>
      )}
    </div>
  );
}