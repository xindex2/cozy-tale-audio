import { useRef, useEffect } from "react";
import { useContainerHeight } from "@/hooks/useContainerHeight";
import { StoryText } from "./StoryText";
import { motion, AnimatePresence } from "framer-motion";

interface StoryDisplayProps {
  text: string | undefined;
  audioUrl: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isStreaming?: boolean;
  streamedContent?: string;
}

export function StoryDisplay({ 
  text = "", 
  audioUrl, 
  isPlaying, 
  currentTime, 
  duration,
  isStreaming,
  streamedContent
}: StoryDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const height = useContainerHeight(containerRef);
  
  // Use streamed content if available, otherwise use the final text
  const displayText = isStreaming ? streamedContent : text;
  
  // Split text into natural phrases using spaces and line breaks
  const phrases = displayText?.split(/\n+/).flatMap(paragraph => 
    paragraph.split(/(?<=[.!?])\s+/).filter(phrase => phrase.trim().length > 0)
  ) || [];
  
  // Calculate the time per phrase based on total duration
  const timePerPhrase = duration > 0 ? duration / phrases.length : 0;
  const currentPhraseIndex = Math.floor(currentTime / timePerPhrase);

  // Auto-scroll to bottom when new content arrives
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayText]);

  return (
    <div 
      ref={containerRef}
      style={{ height: height ? `${height}px` : 'auto', minHeight: '50vh' }}
      className="prose prose-lg max-w-none space-y-4 p-6 bg-white/90 rounded-lg shadow-sm overflow-auto scroll-smooth"
    >
      <AnimatePresence mode="wait">
        {displayText ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <StoryText 
              phrases={phrases}
              currentPhraseIndex={currentPhraseIndex}
              isStreaming={isStreaming}
            />
          </motion.div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-gray-500 italic"
          >
            Story text will appear here...
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}