import { useEffect, useRef } from "react";

interface SynchronizedTextProps {
  text: string;
  audioUrl?: string | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  isFreeTrial?: boolean;
  onAudioGenerated?: (blob: Blob) => Promise<void>;
}

export function SynchronizedText({ 
  text,
  audioUrl,
  isPlaying, 
  currentTime, 
  duration,
  isFreeTrial,
  onAudioGenerated 
}: SynchronizedTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current || !text || duration <= 0) return;
    
    const words = text.split(" ");
    const wordsPerSecond = words.length / duration;
    const currentWordIndex = Math.floor(currentTime * wordsPerSecond);
    
    const elements = containerRef.current.children;
    for (let i = 0; i < elements.length; i++) {
      const element = elements[i] as HTMLSpanElement;
      if (i < currentWordIndex) {
        element.classList.add("text-blue-600");
      } else {
        element.classList.remove("text-blue-600");
      }
    }
  }, [text, currentTime, duration, isPlaying]);

  const sections = text.split(/\n\n+/);

  return (
    <div 
      ref={containerRef}
      className="prose prose-lg max-w-none text-left leading-relaxed space-y-6"
    >
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex} className="space-y-4">
          {section.split('\n').map((paragraph, paragraphIndex) => (
            <p 
              key={`${sectionIndex}-${paragraphIndex}`}
              className="text-gray-800 leading-relaxed"
            >
              {paragraph.split(" ").map((word, wordIndex) => (
                <span
                  key={`${sectionIndex}-${paragraphIndex}-${wordIndex}`}
                  className="transition-colors duration-200 ease-in-out"
                >
                  {word + " "}
                </span>
              ))}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}