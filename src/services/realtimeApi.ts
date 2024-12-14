import { StorySettings } from "@/components/StoryOptions";

class RealtimeApiService {
  private ws: WebSocket | null = null;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 3;

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected");
      return this.ws;
    }

    try {
      // Connect to OpenAI's streaming API
      this.ws = new WebSocket('wss://api.openai.com/v1/audio/speech');
      
      this.ws.onopen = () => {
        console.log("Connected to OpenAI Realtime API");
        this.reconnectAttempts = 0;
      };

      this.ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        this.handleConnectionError();
      };

      this.ws.onclose = () => {
        console.log("Disconnected from OpenAI Realtime API");
        this.handleConnectionError();
      };

      return this.ws;
    } catch (error) {
      console.error("Error creating WebSocket:", error);
      this.handleConnectionError();
      return null;
    }
  }

  private handleConnectionError() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => this.connect(), 1000 * this.reconnectAttempts);
    }
  }

  generateStory(settings: StorySettings) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not connected");
      return;
    }

    // Send story generation request with OpenAI API format
    this.ws.send(JSON.stringify({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: `You are a storyteller creating ${settings.theme} stories for ${settings.ageGroup} year olds. The story should last approximately ${settings.duration} minutes.`
        }
      ],
      stream: true
    }));
  }

  sendText(text: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not connected");
      return;
    }

    this.ws.send(JSON.stringify({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "user",
          content: text
        }
      ],
      stream: true
    }));
  }

  sendAudio(base64Audio: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not connected");
      return;
    }

    this.ws.send(JSON.stringify({
      audio: base64Audio,
      model: "whisper-1"
    }));
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// Initialize with OpenAI API key
export const realtimeApi = new RealtimeApiService();