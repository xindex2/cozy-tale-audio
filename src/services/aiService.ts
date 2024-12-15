import { StorySettings } from "@/components/StoryOptions";

const ELEVEN_LABS_API_URL = "https://api.elevenlabs.io/v1/text-to-speech";

export interface StoryResponse {
  text: string;
  audioUrl: string | null;
  backgroundMusicUrl: string | null;
  title: string;
}

const generateStoryText = async (settings: StorySettings) => {
  // This would ideally be connected to a proper translation API
  // For now, we'll use a simple mapping for demonstration
  const storyTemplates: { [key: string]: { title: string, story: string } } = {
    en: {
      title: "Luna's Magical Adventure",
      story: `Once upon a time in a magical forest, there lived a curious young rabbit named Luna. 
      Luna loved to explore the enchanted woods, making friends with all the woodland creatures she met along her journey.`
    },
    es: {
      title: "La Aventura Mágica de Luna",
      story: `Había una vez en un bosque mágico, vivía una curiosa conejita llamada Luna. 
      A Luna le encantaba explorar el bosque encantado, haciendo amigos con todas las criaturas del bosque que encontraba en su camino.`
    },
    fr: {
      title: "L'Aventure Magique de Luna",
      story: `Il était une fois dans une forêt magique, vivait une jeune lapine curieuse nommée Luna. 
      Luna adorait explorer les bois enchantés, se liant d'amitié avec toutes les créatures de la forêt qu'elle rencontrait lors de son voyage.`
    },
    ar: {
      title: "مغامرة لونا السحرية",
      story: `في يوم من الأيام في غابة سحرية، عاشت أرنبة صغيرة فضولية تدعى لونا. 
      كانت لونا تحب استكشاف الغابة المسحورة، وتكوين صداقات مع جميع مخلوقات الغابة التي قابلتها خلال رحلتها.`
    },
    // Add more languages as needed
  };

  const defaultLanguage = 'en';
  return storyTemplates[settings.language] || storyTemplates[defaultLanguage];
};

const getBackgroundMusicUrl = (musicSetting: string): string | null => {
  const musicMap: { [key: string]: string } = {
    'gentle-lullaby': '/assets/gentle-lullaby.mp3',
    'peaceful-dreams': '/assets/peaceful-dreams.mp3',
    'ocean-waves': '/assets/ocean-waves.mp3',
    'nature-sounds': '/assets/nature-sounds.mp3',
    'soft-piano': '/assets/soft-piano.mp3'
  };

  return musicSetting && musicSetting !== 'no-music' ? musicMap[musicSetting] || null : null;
};

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
          model_id: "eleven_multilingual_v2",
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
      const { title, story } = await generateStoryText(settings);
      let audioUrl = null;
      const backgroundMusicUrl = getBackgroundMusicUrl(settings.music);

      if (settings.voice && settings.voice !== "no-voice") {
        audioUrl = await this.generateAudio(story, settings.voice);
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
