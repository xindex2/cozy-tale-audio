import { memo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface StoryTextProps {
  phrases: string[];
  currentPhraseIndex: number;
  isStreaming?: boolean;
}

export const StoryText = memo(function StoryText({ 
  phrases, 
  currentPhraseIndex,
  isStreaming = false
}: StoryTextProps) {
  const activeRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentPhraseIndex]);

  return (
    <AnimatePresence mode="popLayout">
      {phrases.map((phrase, index) => {
        const isHighlighted = currentPhraseIndex >= 0 && index === currentPhraseIndex;
        const isPast = currentPhraseIndex >= 0 && index < currentPhraseIndex;
        const characters = phrase.split('');
        
        return (
          <motion.p 
            key={index}
            ref={isHighlighted ? activeRef : null}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1,
              y: 0,
              color: isHighlighted ? "#4F46E5" : isPast ? "#6B7280" : "#1F2937",
              scale: isHighlighted ? 1.02 : 1,
            }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`leading-relaxed p-2 rounded-md transition-all duration-300 ${
              isHighlighted 
                ? "bg-indigo-50 font-medium" 
                : ""
            }`}
          >
            <AnimatePresence mode="popLayout">
              {characters.map((char, charIndex) => (
                <motion.span
                  key={`${index}-${charIndex}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ 
                    duration: 0.05,
                    delay: isStreaming ? charIndex * 0.02 : 0 // Only apply typing effect when streaming
                  }}
                >
                  {char}
                </motion.span>
              ))}
            </AnimatePresence>
          </motion.p>
        );
      })}
    </AnimatePresence>
  );
});