import { OPENAI_CONFIG } from './config';
import { ApiKeyManager } from './apiKeyManager';
import { toast } from "@/hooks/use-toast";
import { chunkText } from "@/utils/textChunker";

class OpenAIClient {
  private apiKeyManager: ApiKeyManager;
  private controller: AbortController | null = null;

  constructor() {
    this.apiKeyManager = ApiKeyManager.getInstance();
  }

  private async getHeaders(): Promise<Headers> {
    const apiKey = await this.apiKeyManager.getApiKey();
    return new Headers({
      ...OPENAI_CONFIG.defaultHeaders,
      'Authorization': `Bearer ${apiKey}`,
    });
  }

  async generateSpeech(text: string, voice: string = 'alloy'): Promise<string> {
    try {
      console.log("Generating speech for text:", text.substring(0, 100) + "...");
      
      // Split text into chunks that fit within OpenAI's limit (4096 characters)
      const chunks = chunkText(text, 4000); // Leave some margin
      console.log(`Split text into ${chunks.length} chunks for TTS`);
      
      const audioBlobs: Blob[] = [];

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        console.log(`Processing TTS chunk ${i + 1}/${chunks.length}, length: ${chunk.length}`);

        const headers = await this.getHeaders();
        const response = await fetch(`${OPENAI_CONFIG.baseUrl}/audio/speech`, {
          method: 'POST',
          headers,
          body: JSON.stringify({
            model: 'tts-1',
            input: chunk,
            voice: voice,
          }),
        });

        if (!response.ok) {
          const error = await response.text();
          console.error("OpenAI TTS API error:", error);
          throw new Error(error);
        }

        const audioBlob = await response.blob();
        audioBlobs.push(audioBlob);
        console.log(`Successfully generated audio for chunk ${i + 1}`);
      }

      // Combine all audio blobs
      const combinedBlob = new Blob(audioBlobs, { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(combinedBlob);
      console.log("Speech generated successfully");
      return audioUrl;
    } catch (error: any) {
      console.error("Error generating speech:", error);
      toast({
        title: "Error",
        description: "Failed to generate speech. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }

  async generateContent(prompt: string, systemPrompt?: string, onStream?: (chunk: string) => void) {
    try {
      // Create a new controller for this request
      this.cancelCurrentRequest();
      this.controller = new AbortController();
      
      console.log("Generating content with prompt:", prompt);
      
      const headers = await this.getHeaders();
      const messages = [
        { 
          role: 'system', 
          content: systemPrompt || 'You are a helpful assistant that generates children\'s stories. Format your responses exactly as requested in the prompt.' 
        },
        { role: 'user', content: prompt }
      ];

      const response = await fetch(`${OPENAI_CONFIG.baseUrl}/chat/completions`, {
        method: 'POST',
        headers,
        signal: this.controller.signal,
        body: JSON.stringify({
          model: OPENAI_CONFIG.defaultModel,
          messages,
          stream: true,
          ...OPENAI_CONFIG.generationConfig,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("OpenAI API error:", error);
        throw new Error(error.error?.message || 'Failed to generate content');
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';
      let startTime = Date.now();
      let lastProgressUpdate = startTime;

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.trim() === '' || line.trim() === 'data: [DONE]') continue;
          
          try {
            const jsonStr = line.replace(/^data: /, '');
            const json = JSON.parse(jsonStr);
            const content = json.choices[0]?.delta?.content || '';
            if (content) {
              fullContent += content;
              if (onStream) {
                onStream(content);
              }

              // Update progress every second
              const now = Date.now();
              if (now - lastProgressUpdate > 1000) {
                const elapsedSeconds = Math.floor((now - startTime) / 1000);
                console.log(`Generation in progress... ${elapsedSeconds}s elapsed`);
                lastProgressUpdate = now;
              }
            }
          } catch (e) {
            console.warn('Error parsing streaming response:', e);
            // Continue processing other chunks even if one fails
          }
        }
      }

      const totalTime = (Date.now() - startTime) / 1000;
      console.log(`Content generated successfully in ${totalTime}s`);
      return fullContent;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request was cancelled');
        return '';
      }
      console.error("Error generating content:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate content. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      // Clear the controller after the request is complete
      this.controller = null;
    }
  }

  cancelCurrentRequest() {
    if (this.controller) {
      try {
        this.controller.abort();
      } catch (error) {
        console.warn('Error aborting request:', error);
      }
      this.controller = null;
    }
  }
}

export const openaiClient = new OpenAIClient();