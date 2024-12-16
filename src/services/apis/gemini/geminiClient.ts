import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_MODEL, generationConfig } from "./config";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

class GeminiClient {
  private genAI: GoogleGenerativeAI | null = null;
  private isInitialized = false;
  private retryCount = 0;
  private maxRetries = 3;
  private baseDelay = 2000; // Increased from 1s to 2s

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
            
            // Show toast for retry attempt
            toast({
              title: "API Rate Limit",
              description: `Retrying in ${delayTime / 1000} seconds... (Attempt ${this.retryCount}/${this.maxRetries})`,
              duration: delayTime - 500, // Show toast until just before retry
            });
            
            await this.delay(delayTime);
            continue;
          }
        }
        throw error;
      }
    }
    
    // If we've exhausted all retries, show a final error toast
    toast({
      title: "Error",
      description: "Maximum retry attempts reached. Please try again in a few minutes.",
      variant: "destructive",
    });
    
    throw lastError;
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
          temperature: 0.7,
          candidateCount: 1,
          maxOutputTokens: 2048, // Reduced to help with rate limits
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
      
      // Show appropriate error message based on error type
      const errorMessage = error?.status === 429 
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