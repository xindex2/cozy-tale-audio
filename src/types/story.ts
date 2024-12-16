export interface Story {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export interface Message {
  role: "user" | "assistant";
  content: string;
  audioUrl?: string;
  backgroundMusicUrl?: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}