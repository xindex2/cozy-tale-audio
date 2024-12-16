export interface StoryGenerationSettings {
  ageGroup: string;
  duration: number;
  theme: string;
  language: string;
}

export interface StoryResponse {
  title: string;
  content: string;
  audioUrl?: string;
}