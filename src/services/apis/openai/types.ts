export interface StoryGenerationSettings {
  ageGroup: string;
  duration: number;
  theme: string;
  language: string;
  music?: string;
}

export interface StoryResponse {
  title: string;
  content: string;
  audioUrl?: string;
  backgroundMusicUrl?: string | null;
}