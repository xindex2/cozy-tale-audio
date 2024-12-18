import { useState } from 'react';
import { aiService } from '@/services/aiService';
import type { StorySettings } from '@/components/StoryOptions';
import type { StoryResponse } from '@/services/ai/types';

export function useStoryGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const generateStory = async (settings: StorySettings): Promise<StoryResponse> => {
    setIsGenerating(true);
    setError(null);
    
    try {
      const response = await aiService.generateStory({
        ...settings,
        audio: true // Enable audio by default
      });
      setContent(response.content);
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