export interface StoryResponse {
  text: string;
  audioUrl: string;
  backgroundMusicUrl: string;
  title: string;
}

export const aiService = {
  apiKey: "",

  setApiKey(key: string) {
    this.apiKey = key;
  },

  async startChat(settings: any): Promise<StoryResponse> {
    // Mock implementation
    return {
      text: "Once upon a time...",
      audioUrl: "/assets/gentle-lullaby.mp3",
      backgroundMusicUrl: "/assets/nature-sounds.mp3",
      title: "The Adventure Begins"
    };
  },

  async continueStory(message: string): Promise<StoryResponse> {
    // Mock implementation
    return {
      text: "And then...",
      audioUrl: "/assets/gentle-lullaby.mp3",
      backgroundMusicUrl: "/assets/nature-sounds.mp3",
      title: "The Story Continues"
    };
  }
};