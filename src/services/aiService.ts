import { GoogleGenerativeAI, GenerationConfig } from "@google/generative-ai";
import { StorySettings } from "@/components/StoryOptions";

class AIService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private chat: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI("AIzaSyDonkh1p9UiMvTkKG2vFO9WrbFngqr_PXs");
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-pro",
      generationConfig: {
        temperature: 0.7,
        candidateCount: 1,
        stopSequences: [],
        maxOutputTokens: 800,
        topP: 0.8,
        topK: 40,
      } as GenerationConfig
    });
  }

  async startChat(settings: StorySettings) {
    const prompt = `You are a storyteller creating ${settings.theme} stories for children aged ${settings.ageGroup}. 
                   The story should last approximately ${settings.duration} minutes when read aloud. 
                   Make it engaging and interactive. Do not use markdown formatting like * or **.`;
    
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
    const text = response.text().replace(/\*/g, '');
    
    // Create audio URL from the selected background music
    const audioUrl = `/assets/${settings.music}.mp3`;
    
    return { text, audioUrl };
  }

  async continueStory(message: string) {
    if (!this.chat) throw new Error("Chat not initialized");
    
    const result = await this.chat.sendMessage(message);
    const response = await result.response;
    const text = response.text().replace(/\*/g, '');
    
    // Return the same background music URL for consistency
    const audioUrl = "/assets/gentle-lullaby.mp3";
    
    return { text, audioUrl };
  }
}

export const aiService = new AIService();