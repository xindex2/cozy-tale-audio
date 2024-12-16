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
              color: isHighlighted ? "#4F46E5" : isPast ? "#6B7280" : "#1F2937",
            }}
            transition={{ duration: 0.3 }}
            className={`leading-relaxed p-2 rounded-md transition-all duration-300 ${
              isHighlighted 
                ? "bg-indigo-50 font-medium" 
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