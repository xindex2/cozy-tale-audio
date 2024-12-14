import { GoogleGenerativeAI } from "@google/generative-ai";
import { StorySettings } from "@/components/StoryOptions";

class AIService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private chat: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI("AIzaSyDonkh1p9UiMvTkKG2vFO9WrbFngqr_PXs");
    this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
  }

  async startChat(settings: StorySettings) {
    const prompt = {
      contents: [{
        parts: [{
          text: `You are a storyteller creating ${settings.theme} stories for children aged ${settings.ageGroup}. 
                 The story should last approximately ${settings.duration} minutes when read aloud. 
                 Make it engaging and interactive.`
        }]
      }]
    };
    
    this.chat = this.model.startChat(prompt);
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

  async generateSpeech(text: string) {
    // Using Gemini's text-to-speech capability
    const result = await this.model.generateContent({
      contents: [{ text }],
      generation_config: {
        temperature: 0.7,
        candidate_count: 1,
        stop_sequences: [],
        max_output_tokens: 2048,
        top_p: 0.8,
        top_k: 40,
        response_modalities: ["AUDIO"]
      }
    });
    
    const response = await result.response;
    return response.text();
  }
}

export const aiService = new AIService();