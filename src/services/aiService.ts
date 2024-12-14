import { GoogleGenerativeAI } from "@google/generative-ai";
import { StorySettings } from "@/components/StoryOptions";

class AIService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private chat: any;
  private elevenLabsApiKey: string;

  constructor() {
    this.genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-pro" });
    this.elevenLabsApiKey = import.meta.env.VITE_ELEVEN_LABS_API_KEY;
  }

  async startChat(settings: StorySettings) {
    const prompt = `You are a storyteller creating ${settings.theme} stories for children aged ${settings.ageGroup}. 
                   The story should last approximately ${settings.duration} minutes when read aloud. 
                   Make it engaging and interactive.`;
    
    this.chat = this.model.startChat({
      history: [
        {
          role: "user",
          parts: prompt,
        },
      ],
    });

    const result = await this.chat.sendMessage("Start the story");
    const response = await result.response;
    return response.text();
  }

  async continueStory(message: string) {
    if (!this.chat) throw new Error("Chat not initialized");
    
    const result = await this.chat.sendMessage(message);
    const response = await result.response;
    return response.text();
  }

  async generateSpeech(text: string, voiceId: string = "21m00Tcm4TlvDq8ikWAM") {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': this.elevenLabsApiKey,
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
      throw new Error('Failed to generate speech');
    }

    const audioBlob = await response.blob();
    return URL.createObjectURL(audioBlob);
  }
}

export const aiService = new AIService();