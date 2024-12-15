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
    </>
  );
});