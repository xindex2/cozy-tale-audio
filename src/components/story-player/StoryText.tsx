import { memo } from 'react';

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
        // Only highlight if we have a valid current sentence index
        const isHighlighted = currentSentenceIndex >= 0 && index === currentSentenceIndex;
        const isPast = currentSentenceIndex >= 0 && index < currentSentenceIndex;
        
        return (
          <p 
            key={index} 
            className={`text-gray-800 leading-relaxed transition-all duration-300 ${
              isHighlighted 
                ? "bg-blue-100 font-semibold" 
                : isPast
                ? "text-gray-500"
                : ""
            }`}
          >
            {sentence}
          </p>
        );
      })}
    </>
  );
});