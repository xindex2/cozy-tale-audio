import { StorySettings } from "@/components/StoryOptions";

const ELEVEN_LABS_API_URL = "https://api.elevenlabs.io/v1/text-to-speech";

export interface StoryResponse {
  text: string;
  audioUrl: string | null;
  backgroundMusicUrl: string | null;
  title: string;
}

export const aiService = {
  apiKey: "",

  setApiKey(key: string) {
    this.apiKey = key;
  },

  async generateAudio(text: string, voiceId: string): Promise<string> {
    try {
      const response = await fetch(`${ELEVEN_LABS_API_URL}/${voiceId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": this.apiKey,
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
        throw new Error("Failed to generate audio");
      }

      const audioBlob = await response.blob();
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.error("Error generating audio:", error);
      throw error;
    }
  },

  async startChat(settings: StorySettings): Promise<StoryResponse> {
    try {
      const duration = settings.duration || 5; // Default to 5 minutes if not specified
      const storyText = `Once upon a time in a magical forest, there lived a curious young rabbit named Luna. Luna loved to explore the enchanted woods, making friends with all the woodland creatures she met along her journey. One day, she discovered a mysterious glowing flower that would change her life forever...`;
      const title = "Luna's Magical Adventure";
      
      let audioUrl = null;
      let backgroundMusicUrl = null;

      if (settings.voice && settings.voice !== "no-voice") {
        audioUrl = await this.generateAudio(storyText, settings.voice);
      }

      if (settings.music && settings.music !== "no-music") {
        backgroundMusicUrl = `/assets/${settings.music}.mp3`;
      }

      return {
        text: storyText,
        audioUrl,
        backgroundMusicUrl,
        title
      };
    } catch (error) {
      console.error("Error in startChat:", error);
      throw error;
    }
  },

  async continueStory(message: string): Promise<StoryResponse> {
    try {
      const responseText = `${message}... The magical flower began to glow even brighter as Luna approached it, casting sparkles of light all around the forest clearing...`;
      
      let audioUrl = null;
      if (this.apiKey) {
        audioUrl = await this.generateAudio(responseText, "EXAVITQu4vr4xnSDxMaL");
      }

      return {
        text: responseText,
        audioUrl,
        backgroundMusicUrl: null,
        title: "Story Continuation"
      };
    } catch (error) {
      console.error("Error in continueStory:", error);
      throw error;
    }
  },

  async generateQuiz(storyContent: string): Promise<Array<{
    question: string;
    options: string[];
    correctAnswer: number;
  }>> {
    return [
      {
        question: "Who is the main character of the story?",
        options: ["Luna the rabbit", "Max the fox", "Oliver the owl", "Sophie the squirrel"],
        correctAnswer: 0
      },
      {
        question: "What did Luna discover in the forest?",
        options: ["A treasure chest", "A magical flower", "A secret cave", "A lost map"],
        correctAnswer: 1
      },
      {
        question: "Where does the story take place?",
        options: ["In a city", "In a desert", "In a magical forest", "On a mountain"],
        correctAnswer: 2
      }
    ];
  }
};