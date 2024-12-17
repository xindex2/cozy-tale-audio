export interface StoryGenerationSettings {
  duration: number;
  ageGroup: string;
  theme: string;
  language: string;
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  music?: string;
  audio?: boolean;
}

export interface StoryResponse {
  title: string;
  content: string;
  audioUrl: string | null;
  backgroundMusicUrl: string | null;
}