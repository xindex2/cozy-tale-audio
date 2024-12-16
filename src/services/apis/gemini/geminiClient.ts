import { Configuration, OpenAIApi } from "openai";
import { GEMINI_MODEL, generationConfig } from "./config";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

class GeminiClient {
  private openai: OpenAIApi | null = null;
  private isInitialized = false;
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
        .single();

      if (error || !data?.key_value) {
        throw new Error('No active OpenAI API key found');
      }

      const configuration = new Configuration({
        apiKey: data.key_value,
      });

      this.openai = new OpenAIApi(configuration);
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
        
        if (error?.response?.status === 429) {
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

  async generateContent(prompt: string) {
    if (!this.isInitialized || !this.openai) {
      await this.initialize();
    }

    this.retryCount = 0;
    
    try {
      console.log("Generating content with prompt:", prompt);

      const result = await this.retryWithBackoff(async () => {
        const completion = await this.openai!.createChatCompletion({
          model: "gpt-4",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.7,
          max_tokens: 2048,
        });
        return completion.data.choices[0].message?.content || "";
      });

      console.log("Content generated successfully");
      return result;
    } catch (error: any) {
      console.error("Error generating content:", error);
      
      const errorMessage = error?.response?.status === 429 
        ? "API rate limit reached. Please try again in a few minutes."
        : "Failed to generate content. Please try again.";
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    }
  }
}

export const geminiClient = new GeminiClient();