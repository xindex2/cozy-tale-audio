import { getBackgroundMusicUrl } from './audioService';
import { generateQuiz } from './quizService';
import { generateStoryWithGemini, initializeGemini } from './geminiService';
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

export const aiService = {
  apiKey: "",
  geminiApiKey: "",

  setApiKey(key: string) {
    this.apiKey = key;
  },

  setGeminiApiKey(key: string) {
    this.geminiApiKey = key;
    initializeGemini(key);
  },

  async startChat(settings: StorySettings): Promise<StoryResponse> {
    try {
      if (!this.geminiApiKey) {
        throw new Error("Gemini API key is required for story generation");
      }

      const generated = await generateStoryWithGemini(settings);
      const backgroundMusicUrl = AUDIO_URLS[settings.music as keyof typeof AUDIO_URLS] || null;

      let audioUrl = null;
      if (settings.voice && settings.voice !== "no-voice") {
        // Here you would generate audio from the story text
        // For now, we'll skip this part as it's not the focus of the current changes
        audioUrl = null;
      }

      return {
        text: generated.content,
        audioUrl,
        backgroundMusicUrl,
        title: generated.title
      };
    } catch (error) {
      console.error("Error in startChat:", error);
      throw error;
    }
  },

  async continueStory(message: string, language: string = 'en'): Promise<StoryResponse> {
    const responses: { [key: string]: string } = {
      en: "The magical flower began to glow even brighter as Luna approached it, casting sparkles of light all around the forest clearing. The wise owl nodded knowingly, sharing ancient tales of similar magical occurrences in the forest's history. The playful squirrels performed acrobatic dances through the trees, celebrating the joyous moment.",
      es: "La flor mágica comenzó a brillar aún más cuando Luna se acercó, lanzando destellos de luz por todo el claro del bosque. El sabio búho asintió con conocimiento, compartiendo antiguas historias de sucesos mágicos similares en la historia del bosque. Las ardillas juguetonas realizaron danzas acrobáticas a través de los árboles, celebrando el momento alegre.",
      ar: "بدأت الزهرة السحرية تتوهج بشكل أكثر سطوعًا عندما اقتربت لونا منها، ملقية ببريق من الضوء في جميع أنحاء فسحة الغابة. أومأ البوم الحكيم برأسه بمعرفة، مشاركًا قصصًا قديمة عن أحداث سحرية مماثلة في تاريخ الغابة. قدمت السناجب المرحة رقصات بهلوانية عبر الأشجار، احتفالاً باللحظة السعيدة."
    };

    try {
      const responseText = `${message}... ${responses[language] || responses['en']}`;
      
      let audioUrl = null;
      if (this.apiKey) {
        audioUrl = await generateAudio(responseText, "EXAVITQu4vr4xnSDxMaL", this.apiKey);
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

  generateQuiz(storyContent: string, language: string = 'en') {
    return generateQuiz(storyContent, language);
  }
};
