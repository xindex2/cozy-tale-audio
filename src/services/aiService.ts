export interface StoryResponse {
  text: string;
  audioUrl: string | null;
  backgroundMusicUrl: string | null;
  title: string;
}

export const aiService = {
  apiKey: "",

  setApiKey(key: string) {
    this.apiKey = key;
  },

  async startChat(settings: any): Promise<StoryResponse> {
    try {
      // Generate story text (mock implementation for now)
      const storyText = "Once upon a time in a magical forest, there lived a curious young rabbit named Luna. Luna loved to explore the enchanted woods, making friends with all the woodland creatures she met along her journey. One day, she discovered a mysterious glowing flower that would change her life forever...";
      
      // Handle audio generation only if voice is selected
      let audioUrl = null;
      if (settings.voice !== "no-voice") {
        // Here you would normally call the ElevenLabs API
        audioUrl = "/assets/gentle-lullaby.mp3"; // Mock for now
      }

      // Handle background music only if music is selected
      let backgroundMusicUrl = null;
      if (settings.music !== "no-music") {
        backgroundMusicUrl = `/assets/${settings.music}.mp3`;
      }

      return {
        text: storyText,
        audioUrl,
        backgroundMusicUrl,
        title: "Luna's Magical Adventure"
      };
    } catch (error) {
      console.error("Error in startChat:", error);
      throw error;
    }
  },

  async continueStory(message: string): Promise<StoryResponse> {
    try {
      return {
        text: "The story continues...",
        audioUrl: null,
        backgroundMusicUrl: null,
        title: "The Story Continues"
      };
    } catch (error) {
      console.error("Error in continueStory:", error);
      throw error;
    }
  }
};