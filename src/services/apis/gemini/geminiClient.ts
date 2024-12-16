import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_MODEL, generationConfig } from "./config";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

class GeminiClient {
  private genAI: GoogleGenerativeAI | null = null;
  private isInitialized = false;
  private retryCount = 0;
  private maxRetries = 3;
  private baseDelay = 1000; // 1 second

  async initialize() {
    if (this.isInitialized) return;

    try {
      console.log("Fetching Gemini API key...");
      const { data, error } = await supabase
        .from('api_keys')
        .select('key_value')
        .eq('key_name', 'GEMINI_API_KEY')
        .eq('is_active', true)
        .single();

      if (error || !data?.key_value) {
        throw new Error('No active Gemini API key found');
      }

      this.genAI = new GoogleGenerativeAI(data.key_value);
      this.isInitialized = true;
      console.log("Gemini client initialized successfully");
    } catch (error) {
      console.error("Error initializing Gemini client:", error);
      this.isInitialized = false;
      throw error;
    }
  }

  private async delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async retryWithBackoff(operation: () => Promise<any>) {
    while (this.retryCount < this.maxRetries) {
      try {
        return await operation();
      } catch (error: any) {
        console.error("Operation error:", error);
        
        if (error?.status === 429) {
          this.retryCount++;
          if (this.retryCount < this.maxRetries) {
            const delayTime = this.baseDelay * Math.pow(2, this.retryCount - 1);
            console.log(`Rate limited. Retrying in ${delayTime}ms... (Attempt ${this.retryCount}/${this.maxRetries})`);
            toast({
              title: "Rate limit reached",
              description: `Retrying in ${delayTime / 1000} seconds... (Attempt ${this.retryCount}/${this.maxRetries})`,
            });
            await this.delay(delayTime);
            continue;
          }
        }
        throw error;
      }
    }
    throw new Error("Max retries reached");
  }

  async generateContent(prompt: string) {
    if (!this.isInitialized || !this.genAI) {
      await this.initialize();
    }

    this.retryCount = 0; // Reset retry count for new requests
    
    try {
      console.log("Generating content with prompt:", prompt);
      const model = this.genAI!.getGenerativeModel({ 
        model: GEMINI_MODEL,
        generationConfig: {
          ...generationConfig,
          temperature: 0.7, // Slightly lower temperature for more focused responses
          candidateCount: 1, // Request only one response to reduce API usage
        }
      });

      const result = await this.retryWithBackoff(async () => {
        const response = await model.generateContent(prompt);
        return response;
      });

      console.log("Content generated successfully");
      return result.response.text();
    } catch (error: any) {
      console.error("Error generating content:", error);
      if (error?.status === 429) {
        toast({
          title: "Rate Limit Exceeded",
          description: "Please try again in a few minutes.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to generate content. Please try again.",
          variant: "destructive",
        });
      }
      throw error;
    }
  }
}

export const geminiClient = new GeminiClient();