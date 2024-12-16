import { getBackgroundMusicUrl } from './audioService';
import { generateQuiz } from './quizService';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";
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
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

export const aiService = {
  apiKey: "",
  geminiApiKey: "",
  genAI: null as GoogleGenerativeAI | null,
  chatSession: null as any,

  setApiKey(key: string) {
    this.apiKey = key;
    console.log("ElevenLabs API key set successfully");
  },

  setGeminiApiKey(key: string) {
    if (!key) {
      console.error("Empty Gemini API key provided");
      return;
    }
    
    try {
      console.log("Initializing Gemini API with key...");
      this.geminiApiKey = key;
      this.genAI = new GoogleGenerativeAI(key);
      console.log("Gemini API initialized successfully");
    } catch (error) {
      console.error("Error initializing Gemini API:", error);
      throw new Error("Failed to initialize Gemini API");
    }
  },

  async startChat(settings: StorySettings): Promise<StoryResponse> {
    console.log("Starting chat with settings:", { 
      ageGroup: settings.ageGroup,
      duration: settings.duration,
      theme: settings.theme,
      language: settings.language,
      hasGeminiAPI: !!this.genAI
    });
    
    if (!this.genAI) {
      console.error("Gemini API not initialized. Current state:", {
        hasGeminiKey: !!this.geminiApiKey,
        hasGenAI: !!this.genAI
      });
      throw new Error("Gemini API not properly initialized");
    }

    try {
      console.log("Creating Gemini model...");
      const model = this.genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash-exp",
        generationConfig,
      });

      this.chatSession = model.startChat({
        generationConfig,
        history: [],
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
      
      Format the response as a JSON object with 'title' and 'content' fields.`;

      console.log("Sending prompt to Gemini...");
      const result = await this.chatSession.sendMessage(prompt);
      const text = result.response.text();
      console.log("Received response from Gemini");
      
      try {
        const parsed = JSON.parse(text);
        console.log("Successfully parsed Gemini response as JSON");
        const backgroundMusicUrl = AUDIO_URLS[settings.music as keyof typeof AUDIO_URLS] || null;

        return {
          title: parsed.title || "Bedtime Story",
          text: parsed.content || text,
          audioUrl: null,
          backgroundMusicUrl
        };
      } catch (parseError) {
        console.error("Error parsing Gemini response:", parseError);
        // If JSON parsing fails, create a structured response from the raw text
        const lines = text.split('\n');
        const title = lines[0].replace(/^(Title:|#|\*)/gi, '').trim();
        const content = lines.slice(1).join('\n').trim();
        
        return {
          title: title || "Bedtime Story",
          text: content || text,
          audioUrl: null,
          backgroundMusicUrl: AUDIO_URLS[settings.music as keyof typeof AUDIO_URLS] || null
        };
      }
    } catch (error) {
      console.error("Error generating story with Gemini:", error);
      throw error;
    }
  },

  async continueStory(message: string, language: string = 'en'): Promise<StoryResponse> {
    if (!this.chatSession) {
      throw new Error("Chat session not initialized");
    }

    try {
      const result = await this.chatSession.sendMessage(message);
      const responseText = result.response.text();
      
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
  },

  generateQuiz(storyContent: string, language: string = 'en') {
    return generateQuiz(storyContent, language);
  }
};