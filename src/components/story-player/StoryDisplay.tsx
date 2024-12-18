import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface StoryDisplayProps {
  text: string;
  audioUrl: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isFreeTrial?: boolean;
  onAudioGenerated?: (audioBlob: Blob) => Promise<void>;
}

export function StoryDisplay({ 
  text, 
  audioUrl, 
  isPlaying,
  currentTime,
  duration,
  isFreeTrial = false,
  onAudioGenerated
}: StoryDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  
  const phrases = text.split(/(?<=[.!?])\s+/).filter(phrase => phrase.trim().length > 0);
  const timePerPhrase = duration / phrases.length;
  const currentPhraseIndex = Math.floor(currentTime / timePerPhrase);
  
  // For free trial, only show 20% of the content
  const visiblePhrases = isFreeTrial ? phrases.slice(0, Math.ceil(phrases.length * 0.2)) : phrases;
  
  const progress = Math.min(Math.max((currentTime / (duration || 1)) * 100, 0), 100);

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

  if (!text) {
    return (
      <div className="flex items-center justify-center h-48">
        <p className="text-gray-500">No story content available</p>
      </div>
    );
  }

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
          {visiblePhrases.map((phrase, index) => (
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

        {isFreeTrial && (
          <div className="mt-8 p-6 bg-blue-50 rounded-lg text-center">
            <h3 className="text-lg font-semibold mb-2">
              Unlock the Full Story
            </h3>
            <p className="text-gray-600 mb-4">
              Upgrade your account to access the complete story and all our premium features.
            </p>
            <Button
              onClick={() => navigate('/pricing')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Upgrade Now
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}