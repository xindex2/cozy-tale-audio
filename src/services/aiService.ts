import { getStoryTemplate } from './storyTemplates';
import { generateAudio, getBackgroundMusicUrl } from './audioService';
import { generateQuiz } from './quizService';
import { generateStoryWithGemini, initializeGemini } from './geminiService';
import type { StorySettings } from "@/components/StoryOptions";

export interface StoryResponse {
  text: string;
  audioUrl: string | null;
  backgroundMusicUrl: string | null;
  title: string;
}

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
      let title = "Your Bedtime Story";
      let story = "";

      if (this.geminiApiKey) {
        const prompt = `Create a ${settings.duration} minute bedtime story for ${settings.ageGroup} about ${settings.theme}`;
        const generated = await generateStoryWithGemini(prompt, settings.language);
        title = generated.title;
        story = generated.content;
      } else {
        const template = getStoryTemplate(settings.duration, settings.language);
        title = template.title;
        story = template.story;
      }

      let audioUrl = null;
      const backgroundMusicUrl = getBackgroundMusicUrl(settings.music);

      if (settings.voice && settings.voice !== "no-voice") {
        audioUrl = await generateAudio(story, settings.voice, this.apiKey);
      }

      return {
        text: story,
        audioUrl,
        backgroundMusicUrl,
        title
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