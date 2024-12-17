export interface StoryGenerationSettings {
  duration: number;
  ageGroup: string;
  theme: string;
  language: string;
  audio?: boolean;
  voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  music?: string;
}

export interface StoryResponse {
  title: string;
  content: string;
  audioUrl: string | null;
  backgroundMusicUrl: string | null;
}

export interface StreamingResponse {
  title?: string;
  content?: string;
  done: boolean;
}