import { memo } from 'react';
import { motion } from 'framer-motion';

interface StoryTextProps {
  sentences: string[];
  currentSentenceIndex: number;
}

export const StoryText = memo(function StoryText({ 
  sentences, 
  currentSentenceIndex 
}: StoryTextProps) {
  return (
    <>
      {sentences.map((sentence, index) => {
        const isHighlighted = currentSentenceIndex >= 0 && index === currentSentenceIndex;
        const isPast = currentSentenceIndex >= 0 && index < currentSentenceIndex;
        
        return (
          <motion.p 
            key={index}
            initial={{ opacity: 0.8 }}
            animate={{ 
              opacity: 1,
              backgroundColor: isHighlighted ? "rgba(59, 130, 246, 0.1)" : "transparent",
            }}
            transition={{ duration: 0.3 }}
            className={`text-gray-800 leading-relaxed p-2 rounded-md transition-all duration-300 ${
              isHighlighted 
                ? "font-semibold text-blue-800" 
                : isPast
                ? "text-gray-500"
                : ""
            }`}
          >
            {sentence}
          </motion.p>
        );
      })}
    </>
  );
});