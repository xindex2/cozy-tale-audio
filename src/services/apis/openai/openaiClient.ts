import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

class OpenAIClient {
  private isInitialized = false;
  private apiKey: string | null = null;
  private retryCount = 0;
  private maxRetries = 3;
  private baseDelay = 2000;

  async initialize() {
    if (this.isInitialized) return;

    try {
      console.log("Fetching OpenAI API key...");
      const { data, error } = await supabase
        .from('api_keys')
        .select('key_value')
        .eq('key_name', 'OPENAI_API_KEY')
        .eq('is_active', true)
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error("Error fetching OpenAI API key:", error);
        throw new Error('Failed to fetch OpenAI API key');
      }

      if (!data?.key_value) {
        throw new Error('No active OpenAI API key found');
      }

      this.apiKey = data.key_value;
      this.isInitialized = true;
      console.log("OpenAI client initialized successfully");
    } catch (error) {
      console.error("Error initializing OpenAI client:", error);
      this.isInitialized = false;
      throw error;
    }
  }

  private async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async retryWithBackoff(operation: () => Promise<any>) {
    let lastError: any = null;
    
    while (this.retryCount < this.maxRetries) {
      try {
        return await operation();
      } catch (error: any) {
        lastError = error;
        console.error("Operation error:", error);
        
        if (error?.status === 429) {
          this.retryCount++;
          if (this.retryCount < this.maxRetries) {
            const delayTime = this.baseDelay * Math.pow(2, this.retryCount - 1);
            console.log(`Rate limited. Retrying in ${delayTime}ms... (Attempt ${this.retryCount}/${this.maxRetries})`);
            
            toast({
              title: "API Rate Limit",
              description: `Retrying in ${delayTime / 1000} seconds... (Attempt ${this.retryCount}/${this.maxRetries})`,
              duration: delayTime - 500,
            });
            
            await this.delay(delayTime);
            continue;
          }
        }
        throw error;
      }
    }
    
    toast({
      title: "Error",
      description: "Maximum retry attempts reached. Please try again in a few minutes.",
      variant: "destructive",
    });
    
    throw lastError;
  }

  async generateSpeech(text: string, voice: string = 'alloy'): Promise<string> {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      console.log("Generating speech for text:", text.substring(0, 100) + "...");
      
      const response = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
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
        description: error.message || "Failed to generate speech. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }

  async generateContent(prompt: string, systemPrompt?: string, onStream?: (chunk: string) => void) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    this.retryCount = 0;
    
    try {
      console.log("Generating content with prompt:", prompt);
      
      const result = await this.retryWithBackoff(async () => {
        const messages = [
          { 
            role: 'system', 
            content: systemPrompt || 'You are a helpful assistant that generates children\'s stories. Format your responses exactly as requested in the prompt.' 
          },
          { role: 'user', content: prompt }
        ];

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages,
            temperature: 0.7,
            stream: true,
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
            if (line.trim() === '') continue;
            if (line.trim() === 'data: [DONE]') continue;
            
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

        return fullContent;
      });

      console.log("Content generated successfully");
      return result;
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