import { OPENAI_CONFIG } from './config';
import { ApiKeyManager } from './apiKeyManager';
import { toast } from "@/hooks/use-toast";

class OpenAIClient {
  private apiKeyManager: ApiKeyManager;

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
      
      const headers = await this.getHeaders();
      const response = await fetch(`${OPENAI_CONFIG.baseUrl}/audio/speech`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: 'tts-1',
          input: text,
          voice: voice,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("OpenAI TTS API error:", error);
        throw new Error(error.error?.message || 'Failed to generate speech');
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
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
        body: JSON.stringify({
          model: OPENAI_CONFIG.defaultModel,
          messages,
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
            }
          } catch (e) {
            console.error('Error parsing streaming response:', e);
          }
        }
      }

      console.log("Content generated successfully");
      return fullContent;
    } catch (error: any) {
      console.error("Error generating content:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to generate content. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }
}

export const openaiClient = new OpenAIClient();