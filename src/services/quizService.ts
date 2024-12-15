interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

const quizTemplates: { [key: string]: QuizQuestion[] } = {
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

export const generateQuiz = (storyContent: string, language: string = 'en'): QuizQuestion[] => {
  return quizTemplates[language] || quizTemplates['en'];
};
