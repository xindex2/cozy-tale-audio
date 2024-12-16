export interface Story {
  id: string;
  title: string;
  content: string;
  created_at: string;
  settings?: any;
  audio_url?: string | null;
  background_music_url?: string | null;
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