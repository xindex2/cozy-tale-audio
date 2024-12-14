import { GoogleGenerativeAI, GenerationConfig } from "@google/generative-ai";
import { StorySettings } from "@/components/StoryOptions";

class AIService {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private chat: any;
  private ELEVEN_LABS_API_KEY: string = "";

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

  async generateVoiceAudio(text: string, voiceId: string): Promise<string> {
    try {
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": this.ELEVEN_LABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("ElevenLabs API error:", errorData);
        throw new Error(`Failed to generate voice audio: ${errorData.detail?.message || response.statusText}`);
      }

      const audioBlob = await response.blob();
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.error("Error generating voice audio:", error);
      throw error;
    }
  }

  async startChat(settings: StorySettings) {
    const prompt = `You are a gentle and soothing bedtime storyteller. Create a calming ${settings.theme} story perfect for bedtime, designed for children aged ${settings.ageGroup}. 
                   The story should last approximately ${settings.duration} minutes when read aloud.
                   Include soft, descriptive language and peaceful imagery.
                   Create moments for interaction but keep them gentle and sleepy.
                   End the story with a calming conclusion that helps prepare for sleep.
                   Do not use any special formatting like asterisks or markdown.
                   Respond in a way that feels like a natural bedtime conversation.`;
    
    this.chat = this.model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    });

    const result = await this.chat.sendMessage("Please start our bedtime story...");
    const response = await result.response;
    const text = response.text().replace(/\*/g, '');
    
    // Generate voice audio using ElevenLabs
    const voiceAudioUrl = await this.generateVoiceAudio(text, settings.voice);
    
    // Create background music URL
    const musicUrl = `/assets/${settings.music}.mp3`;
    
    return { 
      text, 
      audioUrl: voiceAudioUrl,
      backgroundMusicUrl: musicUrl 
    };
  }

  async continueStory(message: string) {
    if (!this.chat) throw new Error("Chat not initialized");
    
    const result = await this.chat.sendMessage(message);
    const response = await result.response;
    const text = response.text().replace(/\*/g, '');
    
    // Generate voice audio for the response
    const voiceAudioUrl = await this.generateVoiceAudio(text, "EXAVITQu4vr4xnSDxMaL"); // Using Sarah's voice for continuations
    
    return { 
      text, 
      audioUrl: voiceAudioUrl,
      backgroundMusicUrl: "/assets/gentle-lullaby.mp3"
    };
  }

  setApiKey(apiKey: string) {
    this.ELEVEN_LABS_API_KEY = apiKey;
  }
}

export const aiService = new AIService();