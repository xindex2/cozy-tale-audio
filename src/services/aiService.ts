import { GoogleGenerativeAI, GenerateContentConfig } from "@google/generative-ai";
import { StorySettings } from "@/components/StoryOptions";

class AIService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private chat: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI("AIzaSyDonkh1p9UiMvTkKG2vFO9WrbFngqr_PXs");
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp"
    });
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
      generationConfig: {
        temperature: 0.7,
      }
    });

    const result = await this.chat.sendMessage("Start the story", {
      generationConfig: new GenerateContentConfig({
        temperature: 0.7,
        candidate_count: 1,
        stop_sequences: [],
        max_output_tokens: 800,
        top_p: 0.8,
        top_k: 40,
      }),
    });
    
    const response = await result.response;
    const text = response.text();
    const audioData = response.audio?.data;
    
    let audioUrl = "";
    if (audioData) {
      const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });
      audioUrl = URL.createObjectURL(audioBlob);
    }
    
    return { text, audioUrl };
  }

  async continueStory(message: string) {
    if (!this.chat) throw new Error("Chat not initialized");
    
    const result = await this.chat.sendMessage(message, {
      generationConfig: new GenerateContentConfig({
        temperature: 0.7,
        candidate_count: 1,
        stop_sequences: [],
        max_output_tokens: 800,
        top_p: 0.8,
        top_k: 40,
      }),
    });
    
    const response = await result.response;
    const text = response.text();
    const audioData = response.audio?.data;
    
    let audioUrl = "";
    if (audioData) {
      const audioBlob = new Blob([audioData], { type: 'audio/mpeg' });
      audioUrl = URL.createObjectURL(audioBlob);
    }
    
    return { text, audioUrl };
  }
}

export const aiService = new AIService();