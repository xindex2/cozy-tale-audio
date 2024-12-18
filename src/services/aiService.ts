import { supabase } from "@/integrations/supabase/client";
import { audioService } from './audioService';
import { generateQuiz } from './quizService';
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { StorySettings } from "@/components/StoryOptions";

export interface StoryResponse {
  text: string;
  audioUrl: string | null;
  backgroundMusicUrl: string | null;
  title: string;
}

const AUDIO_URLS = {
  "gentle-lullaby": "https://cdn.pixabay.com/download/audio/2023/09/05/audio_168a3e0caa.mp3",
  "peaceful-dreams": "https://cdn.pixabay.com/download/audio/2023/05/16/audio_166b9c7242.mp3",
  "ocean-waves": "https://cdn.pixabay.com/download/audio/2022/02/23/audio_ea70ad08e3.mp3",
  "soft-piano": "https://cdn.pixabay.com/download/audio/2024/11/04/audio_4956b4edd1.mp3",
  "nature-sounds": "https://cdn.pixabay.com/download/audio/2024/09/10/audio_6e5d7d1912.mp3"
};

const generationConfig = {
  temperature: 0.9,
  topP: 1,
  topK: 40,
  maxOutputTokens: 8192,
};

class AIService {
  private apiKey: string = "";
  private geminiApiKey: string = "";
  private genAI: GoogleGenerativeAI | null = null;
  private chatSession: any = null;
  private isInitialized: boolean = false;

  setApiKey(key: string) {
    this.apiKey = key;
    console.log("ElevenLabs API key set successfully");
  }

  async initializeGemini(key: string) {
    if (!key) {
      console.error("Empty Gemini API key provided");
      throw new Error("Invalid Gemini API key");
    }

    try {
      console.log("Initializing Gemini API with key...");
      this.geminiApiKey = key;
      this.genAI = new GoogleGenerativeAI(key);
      this.isInitialized = true;
      console.log("Gemini API initialized successfully");
    } catch (error) {
      console.error("Error initializing Gemini API:", error);
      this.isInitialized = false;
      throw new Error("Failed to initialize Gemini API");
    }
  }

  setGeminiApiKey(key: string) {
    return this.initializeGemini(key);
  }

  private ensureInitialized() {
    if (!this.isInitialized || !this.genAI) {
      console.error("Gemini API not initialized");
      throw new Error("Story generation service not properly initialized. Please try again in a few moments.");
    }
  }

  async generateStory(settings: StorySettings): Promise<StoryResponse> {
    console.log("Starting story generation with settings:", settings);
    
    this.ensureInitialized();

    try {
      console.log("Creating Gemini model...");
      const model = this.genAI!.getGenerativeModel({ 
        model: "gemini-pro",
        generationConfig: {
          ...generationConfig,
          temperature: 1,
        },
      });

      this.chatSession = model.startChat({
        history: [],
        generationConfig: {
          ...generationConfig,
          temperature: 1,
        },
      });

      console.log("Gemini chat session created successfully");

      const prompt = `Create a unique and engaging ${settings.duration} minute bedtime story for children aged ${settings.ageGroup} with the theme: ${settings.theme}.
      The story should be in ${settings.language} language.
      Include elements that are:
      1. Age-appropriate and engaging for ${settings.ageGroup} year olds
      2. Related to the theme of ${settings.theme}
      3. Have a clear beginning, middle, and end
      4. Include descriptive language and dialogue
      5. Have a positive message or moral
      6. Be approximately ${settings.duration} minutes when read aloud
      
      Make sure this story is unique and different from previous ones.
      
      Write the story in plain text format. Start with the title, then add two empty lines, and then write the story content.
      Do not use any special formatting, markdown, or code blocks.`;

      console.log("Sending prompt to Gemini...");
      const result = await this.chatSession.sendMessage(prompt);
      const response = await result.response.text();
      console.log("Received response from Gemini");
      
      // Clean and parse the response
      const cleanedResponse = response
        .replace(/```[^`]*```/g, '') // Remove code blocks
        .replace(/\n{3,}/g, '\n\n')  // Normalize multiple line breaks
        .trim();
      
      const [title, ...contentParts] = cleanedResponse.split('\n\n');
      const cleanTitle = title
        .replace(/^(Title:|\#|\*)/gi, '')
        .trim();
      const content = contentParts.join('\n\n').trim();
      
      console.log("Successfully processed story response");
      
      return {
        title: cleanTitle,
        text: content,
        audioUrl: null,
        backgroundMusicUrl: null
      };
    } catch (error) {
      console.error("Error generating story with Gemini:", error);
      throw new Error("Failed to generate story. Please try again.");
    }
  }

  async continueStory(message: string, language: string = 'en'): Promise<StoryResponse> {
    this.ensureInitialized();

    if (!this.chatSession) {
      throw new Error("Chat session not initialized");
    }

    try {
      const result = await this.chatSession.sendMessage(message);
      const responseText = await result.response.text();
      
      return {
        text: responseText,
        audioUrl: null,
        backgroundMusicUrl: null,
        title: "Story Continuation"
      };
    } catch (error) {
      console.error("Error in continueStory:", error);
      throw error;
    }
  }

  generateQuiz(storyContent: string, language: string = 'en') {
    return generateQuiz(storyContent, language);
  }
}

export const aiService = new AIService();
