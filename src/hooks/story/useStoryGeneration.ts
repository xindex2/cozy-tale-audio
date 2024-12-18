import { useState } from 'react';
import { aiService } from '@/services/aiService';
import type { StorySettings } from '@/components/StoryOptions';

export function useStoryGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const generateStory = async (settings: StorySettings) => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await aiService.generateStory(settings);
      setContent(response.text);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate story';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateStory,
    isGenerating,
    content,
    error
  };
}