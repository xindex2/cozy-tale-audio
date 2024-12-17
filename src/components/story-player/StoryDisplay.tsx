import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";

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
  
  // Split text into phrases for highlighting
  const phrases = text.split(/(?<=[.!?])\s+/).filter(phrase => phrase.trim().length > 0);
  const timePerPhrase = duration / phrases.length;
  const currentPhraseIndex = Math.floor(currentTime / timePerPhrase);
  
  // Calculate progress percentage - ensure it's between 0 and 100
  const progress = Math.min(Math.max((currentTime / duration) * 100, 0), 100);

  // Scroll to current phrase
  useEffect(() => {
    if (containerRef.current && currentPhraseIndex >= 0) {
      const phrases = containerRef.current.children;
      const currentPhrase = phrases[currentPhraseIndex];
      
      if (currentPhrase) {
        currentPhrase.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center'
        });
      }
    }
  }, [currentPhraseIndex]);

  return (
    <div className="space-y-4">
      <Progress 
        value={progress} 
        className="w-full h-2 bg-gray-200"
      />
      
      <div 
        ref={containerRef}
        className="prose prose-lg max-w-none space-y-2 p-6 bg-white/90 rounded-lg shadow-sm overflow-auto max-h-[60vh]"
      >
        <AnimatePresence mode="wait">
          {phrases.map((phrase, index) => (
            <motion.p
              key={index}
              initial={{ opacity: 0.7 }}
              animate={{ 
                opacity: 1,
                color: index === currentPhraseIndex ? "#4F46E5" : 
                       index < currentPhraseIndex ? "#6B7280" : "#1F2937",
                scale: index === currentPhraseIndex ? 1.02 : 1,
              }}
              transition={{ duration: 0.3 }}
              className={`leading-relaxed transition-all duration-300 ${
                index === currentPhraseIndex ? "bg-indigo-50 font-medium p-2 rounded-md" : ""
              }`}
            >
              {phrase}
            </motion.p>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}