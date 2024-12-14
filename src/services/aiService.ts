import { GoogleGenerativeAI } from "@google/generative-ai";
import { StorySettings } from "@/components/StoryOptions";

class AIService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private chat: any;
  private ELEVEN_LABS_API_KEY: string = ""; // User needs to provide this

  constructor() {
    this.genAI = new GoogleGenerativeAI("AIzaSyDonkh1p9UiMvTkKG2vFO9WrbFngqr_PXs");
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
  }

  async startChat(settings: StorySettings) {
    const prompt = `You are a storyteller creating ${settings.theme} stories for children aged ${settings.ageGroup}. 
                   The story should last approximately ${settings.duration} minutes when read aloud. 
                   Make it engaging and interactive.`;
    
    this.chat = this.model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const result = await this.chat.sendMessage("Start the story");
    const response = await result.response;
    const text = response.text();
    
    const audioUrl = await this.generateSpeech(text);
    return { text, audioUrl };
  }

  async continueStory(message: string) {
    if (!this.chat) throw new Error("Chat not initialized");
    
    const result = await this.chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();
    
    const audioUrl = await this.generateSpeech(text);
    return { text, audioUrl };
  }

  async generateSpeech(text: string): Promise<string> {
    if (!this.ELEVEN_LABS_API_KEY) {
      console.warn("ElevenLabs API key not set. Using text-only output.");
      return "";
    }

    try {
      const response = await fetch("https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": this.ELEVEN_LABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate speech");
      }

      const audioBlob = await response.blob();
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.error("Error generating speech:", error);
      return "";
    }
  }

  setElevenLabsApiKey(apiKey: string) {
    this.ELEVEN_LABS_API_KEY = apiKey;
  }
}

export const aiService = new AIService();