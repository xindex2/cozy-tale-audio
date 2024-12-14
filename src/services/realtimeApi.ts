import { StorySettings } from "@/components/StoryOptions";

class RealtimeApiService {
  private ws: WebSocket | null = null;
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  connect() {
    // Include authorization in the URL as a query parameter
    const encodedKey = encodeURIComponent(`Bearer ${this.apiKey}`);
    const url = `wss://api.openai.com/v1/realtime?model=gpt-4o-realtime-preview-2024-10-01&authorization=${encodedKey}`;
    
    try {
      this.ws = new WebSocket(url);

      this.ws.onopen = () => {
        console.log("Connected to OpenAI Realtime API");
        // Send beta header information as a message after connection
        if (this.ws) {
          this.ws.send(JSON.stringify({
            type: "metadata",
            metadata: {
              "OpenAI-Beta": "realtime=v1"
            }
          }));
        }
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      this.ws.onclose = () => {
        console.log("Disconnected from OpenAI Realtime API");
      };

      return this.ws;
    } catch (error) {
      console.error("Error creating WebSocket:", error);
      return null;
    }
  }

  sendText(text: string) {
    if (!this.ws) return;

    // Send text message
    this.ws.send(JSON.stringify({
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [{
          type: "input_text",
          text: text
        }]
      }
    }));

    // Request response
    this.ws.send(JSON.stringify({ type: "response.create" }));
  }

  sendAudio(base64Audio: string) {
    if (!this.ws) return;

    // Send audio message
    this.ws.send(JSON.stringify({
      type: "conversation.item.create",
      item: {
        type: "message",
        role: "user",
        content: [{
          type: "input_audio",
          audio: base64Audio
        }]
      }
    }));

    // Request response
    this.ws.send(JSON.stringify({ type: "response.create" }));
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

// Initialize with the provided API key
export const realtimeApi = new RealtimeApiService("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");