import { StorySettings } from "@/components/StoryOptions";

const ELEVEN_LABS_API_URL = "https://api.elevenlabs.io/v1/text-to-speech";

export interface StoryResponse {
  text: string;
  audioUrl: string | null;
  backgroundMusicUrl: string | null;
  title: string;
}

const generateStoryText = async (settings: StorySettings) => {
  // Story templates with different lengths and languages
  const storyTemplates: { [key: string]: { [key: string]: { title: string, story: string } } } = {
    short: {
      en: {
        title: "Luna's Quick Adventure",
        story: "Once upon a time, Luna the rabbit found a magical flower in the forest. Its glow made all the animals gather around in wonder. They danced and played until sunset, making new friends."
      },
      es: {
        title: "La Breve Aventura de Luna",
        story: "Había una vez, Luna la coneja encontró una flor mágica en el bosque. Su brillo hizo que todos los animales se reunieran maravillados. Bailaron y jugaron hasta el atardecer, haciendo nuevos amigos."
      },
      ar: {
        title: "مغامرة لونا القصيرة",
        story: "ذات مرة، وجدت الأرنبة لونا زهرة سحرية في الغابة. جعل توهجها جميع الحيوانات تتجمع في دهشة. رقصوا ولعبوا حتى غروب الشمس، مكونين صداقات جديدة."
      }
    },
    medium: {
      en: {
        title: "Luna's Magical Journey",
        story: "Once upon a time, Luna the rabbit discovered a mysterious glowing flower in the enchanted forest. Its radiant light attracted all the woodland creatures, from tiny mice to wise owls. They gathered in amazement, sharing stories of ancient forest magic. As the day turned to dusk, they celebrated with songs and dance, creating lasting friendships under the starlit sky."
      },
      es: {
        title: "El Viaje Mágico de Luna",
        story: "Había una vez, Luna la coneja descubrió una misteriosa flor brillante en el bosque encantado. Su luz radiante atrajo a todas las criaturas del bosque, desde pequeños ratones hasta sabios búhos. Se reunieron asombrados, compartiendo historias de antigua magia del bosque. Cuando el día se convirtió en atardecer, celebraron con canciones y bailes, creando amistades duraderas bajo el cielo estrellado."
      },
      ar: {
        title: "رحلة لونا السحرية",
        story: "ذات مرة، اكتشفت الأرنبة لونا زهرة متوهجة غامضة في الغابة المسحورة. جذب ضوؤها المشع جميع مخلوقات الغابة، من الفئران الصغيرة إلى البوم الحكيم. تجمعوا في دهشة، يتشاركون قصص سحر الغابة القديم. عندما تحول النهار إلى غسق، احتفلوا بالأغاني والرقص، مكونين صداقات دائمة تحت السماء المرصعة بالنجوم."
      }
    },
    long: {
      en: {
        title: "Luna's Epic Forest Tale",
        story: "Once upon a time, in the heart of an enchanted forest, lived a curious rabbit named Luna. One magical morning, she discovered a mysterious flower that glowed with rainbow colors. Its radiant light attracted all the woodland creatures, from tiny mice to wise owls, and even the shy deer family. They gathered around in amazement, sharing ancient stories of forest magic passed down through generations. As the day progressed, more animals joined their circle, each bringing their own special magic to share. The squirrels performed acrobatic dances in the trees, while the birds sang melodies that seemed to make the flower glow even brighter. When day turned to dusk, they celebrated with a grand feast of forest berries and honey, dancing and singing under the starlit sky. That day, Luna learned that the greatest magic of all was the power of bringing friends together, creating bonds that would last forever in their enchanted forest home."
      },
      es: {
        title: "El Cuento Épico del Bosque de Luna",
        story: "Había una vez, en el corazón de un bosque encantado, vivía una coneja curiosa llamada Luna. Una mañana mágica, descubrió una flor misteriosa que brillaba con colores del arcoíris. Su luz radiante atrajo a todas las criaturas del bosque, desde pequeños ratones hasta sabios búhos, e incluso la tímida familia de ciervos. Se reunieron asombrados, compartiendo antiguas historias de magia del bosque transmitidas por generaciones. A medida que avanzaba el día, más animales se unieron a su círculo, cada uno trayendo su propia magia especial para compartir. Las ardillas realizaron danzas acrobáticas en los árboles, mientras los pájaros cantaban melodías que parecían hacer que la flor brillara aún más. Cuando el día se convirtió en atardecer, celebraron con un gran festín de bayas del bosque y miel, bailando y cantando bajo el cielo estrellado. Ese día, Luna aprendió que la mayor magia de todas era el poder de unir a los amigos, creando lazos que durarían para siempre en su hogar del bosque encantado."
      },
      ar: {
        title: "حكاية لونا الملحمية في الغابة",
        story: "ذات مرة، في قلب غابة مسحورة، عاشت أرنبة فضولية تدعى لونا. في صباح سحري، اكتشفت زهرة غامضة تتوهج بألوان قوس قزح. جذب ضوؤها المشع جميع مخلوقات الغابة، من الفئران الصغيرة إلى البوم الحكيم، وحتى عائلة الغزلان الخجولة. تجمعوا في دهشة، يتشاركون قصصًا قديمة عن سحر الغابة المتوارث عبر الأجيال. مع تقدم النهار، انضم المزيد من الحيوانات إلى دائرتهم، كل منهم يجلب سحره الخاص للمشاركة. قدمت السناجب رقصات بهلوانية في الأشجار، بينما غنت الطيور ألحانًا بدت وكأنها تجعل الزهرة تتوهج بشكل أكثر سطوعًا. عندما تحول النهار إلى غسق، احتفلوا بوليمة كبيرة من توت الغابة والعسل، يرقصون ويغنون تحت السماء المرصعة بالنجوم. في ذلك اليوم، تعلمت لونا أن أعظم سحر على الإطلاق كان قوة جمع الأصدقاء معًا، مكونة روابط ستدوم إلى الأبد في منزلهم في الغابة المسحورة."
      }
    }
  };

  // Determine story length based on duration
  let lengthKey = 'medium';
  if (settings.duration <= 5) {
    lengthKey = 'short';
  } else if (settings.duration >= 15) {
    lengthKey = 'long';
  }

  // Get story in selected language or fallback to English
  const languageStories = storyTemplates[lengthKey];
  const story = languageStories[settings.language] || languageStories['en'];
  return story;
};

const getBackgroundMusicUrl = (musicSetting: string): string | null => {
  const musicMap: { [key: string]: string } = {
    'gentle-lullaby': '/assets/gentle-lullaby.mp3',
    'sleeping-lullaby': '/assets/peaceful-dreams.mp3',
    'water-dreams': '/assets/ocean-waves.mp3',
    'forest-birds': '/assets/nature-sounds.mp3',
    'relaxing-piano': '/assets/soft-piano.mp3'
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

  async continueStory(message: string, language: string = 'en'): Promise<StoryResponse> {
    const responses: { [key: string]: string } = {
      en: "The magical flower began to glow even brighter as Luna approached it, casting sparkles of light all around the forest clearing...",
      es: "La flor mágica comenzó a brillar aún más cuando Luna se acercó, lanzando destellos de luz por todo el claro del bosque...",
      ar: "بدأت الزهرة السحرية تتوهج بشكل أكثر سطوعًا عندما اقتربت لونا منها، ملقية ببريق من الضوء في جميع أنحاء فسحة الغابة..."
    };

    try {
      const responseText = `${message}... ${responses[language] || responses['en']}`;
      
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

  async generateQuiz(storyContent: string, language: string = 'en'): Promise<Array<{
    question: string;
    options: string[];
    correctAnswer: number;
  }>> {
    const quizTemplates: { [key: string]: Array<{
      question: string;
      options: string[];
      correctAnswer: number;
    }> } = {
      en: [
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
      ],
      es: [
        {
          question: "¿Quién es el personaje principal de la historia?",
          options: ["Luna la coneja", "Max el zorro", "Oliver el búho", "Sophie la ardilla"],
          correctAnswer: 0
        },
        {
          question: "¿Qué descubrió Luna en el bosque?",
          options: ["Un cofre del tesoro", "Una flor mágica", "Una cueva secreta", "Un mapa perdido"],
          correctAnswer: 1
        },
        {
          question: "¿Dónde tiene lugar la historia?",
          options: ["En una ciudad", "En un desierto", "En un bosque mágico", "En una montaña"],
          correctAnswer: 2
        }
      ],
      ar: [
        {
          question: "من هي الشخصية الرئيسية في القصة؟",
          options: ["لونا الأرنبة", "ماكس الثعلب", "أوليفر البومة", "صوفي السنجاب"],
          correctAnswer: 0
        },
        {
          question: "ماذا اكتشفت لونا في الغابة؟",
          options: ["صندوق كنز", "زهرة سحرية", "كهف سري", "خريطة مفقودة"],
          correctAnswer: 1
        },
        {
          question: "أين تدور أحداث القصة؟",
          options: ["في مدينة", "في صحراء", "في غابة سحرية", "على جبل"],
          correctAnswer: 2
        }
      ]
    };

    return quizTemplates[language] || quizTemplates['en'];
  }
};