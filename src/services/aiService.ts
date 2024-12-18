import { generateStory } from './ai/storyGenerator';
import { generateQuiz } from './ai/quizGenerator';
import { generateChatResponse } from './ai/chatGenerator';
import type { StoryGenerationSettings, StoryResponse } from './ai/types';

class AIService {
  async generateStory(settings: StoryGenerationSettings): Promise<StoryResponse> {
    return generateStory(settings);
  }

  generateQuiz(storyContent: string, language: string = 'en'): Promise<string> {
    return generateQuiz(storyContent, language);
  }

  generateContent(prompt: string, storyContext?: string): Promise<string> {
    return generateChatResponse(prompt, storyContext);
  }
}

export const aiService = new AIService();