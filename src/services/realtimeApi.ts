import { StorySettings } from "@/components/StoryOptions";

class RealtimeApiService {
  private ws: WebSocket | null = null;
  private apiKey: string;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 3;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.log("WebSocket already connected");
      return this.ws;
    }

    try {
      // Include authorization in the URL as a query parameter
      const encodedKey = encodeURIComponent(`Bearer ${this.apiKey}`);
      const url = `wss://api.openai.com/v1/audio/speech?model=tts-1&voice=alloy&authorization=${encodedKey}`;
      
      this.ws = new WebSocket(url);

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

    // Send story generation request
    this.ws.send(JSON.stringify({
      type: "story.generate",
      settings: {
        theme: settings.theme,
        ageGroup: settings.ageGroup,
        duration: settings.duration,
        voice: settings.voice
      }
    }));
  }

  sendText(text: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not connected");
      return;
    }

    this.ws.send(JSON.stringify({
      type: "message",
      content: text
    }));
  }

  sendAudio(base64Audio: string) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      console.error("WebSocket is not connected");
      return;
    }

    this.ws.send(JSON.stringify({
      type: "audio",
      data: base64Audio
    }));
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