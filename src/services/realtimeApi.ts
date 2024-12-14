import { StorySettings } from "@/components/StoryOptions";

class RealtimeApiService {
  private ws: WebSocket | null = null;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  connect() {
    const url = "wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01";
    this.ws = new WebSocket(url, {
      headers: {
        "Authorization": `Bearer ${this.apiKey}`,
        "OpenAI-Beta": "realtime=v1",
      },
    });

    this.ws.onopen = () => {
      console.log("Connected to OpenAI Realtime API");
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    this.ws.onclose = () => {
      console.log("Disconnected from OpenAI Realtime API");
    };

    return this.ws;
  }

  generateStory(settings: StorySettings) {
    if (!this.ws) return;

    // Set session configuration
    this.ws.send(JSON.stringify({
      type: "session.update",
      session: {
        voice: settings.voice,
        instructions: `You are a friendly storyteller creating a ${settings.duration} minute bedtime story for children aged ${settings.ageGroup} years. The story theme is ${settings.theme}. Keep the tone gentle and engaging, perfect for bedtime. The story should naturally conclude within the specified duration.`
      }
    }));

    // Start the story generation
    this.ws.send(JSON.stringify({
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [{
          type: "input_text",
          text: `Tell me a ${settings.theme} themed bedtime story suitable for children aged ${settings.ageGroup} years that will last about ${settings.duration} minutes.`
        }]
      }
    }));

    // Request response
    this.ws.send(JSON.stringify({ type: "response.create" }));
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const realtimeApi = new RealtimeApiService("YOUR_API_KEY");