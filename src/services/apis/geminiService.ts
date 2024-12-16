import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private isInitialized = false;
  private maxRetries = 3;
  private baseDelay = 1000; // Base delay of 1 second

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

      if (error) {
        console.error('Error fetching Gemini API key:', error);
        throw new Error('Failed to fetch Gemini API key. Please ensure it is set in the API keys table.');
      }

      if (!data?.key_value) {
        throw new Error('No active Gemini API key found. Please add one in the API keys table.');
      }

      this.genAI = new GoogleGenerativeAI(data.key_value);
      this.isInitialized = true;
      console.log("Gemini API initialized successfully");
    } catch (error) {
      console.error("Error initializing Gemini:", error);
      this.isInitialized = false;
      throw error;
    }
  }

  private async retryWithBackoff<T>(operation: () => Promise<T>, retryCount = 0): Promise<T> {
    try {
      return await operation();
    } catch (error: any) {
      console.log("Operation failed:", error);
      
      // Check if it's a rate limit error (429)
      const isRateLimit = error?.status === 429 || 
                         (error?.body && JSON.parse(error.body)?.error?.code === 429);

      if (isRateLimit && retryCount < this.maxRetries) {
        const delay = this.baseDelay * Math.pow(2, retryCount); // Exponential backoff
        console.log(`Rate limited. Retrying in ${delay}ms... (Attempt ${retryCount + 1}/${this.maxRetries})`);
        
        toast({
          title: "Rate limit reached",
          description: `Retrying in ${delay / 1000} seconds...`,
          variant: "default",
        });

        await new Promise(resolve => setTimeout(resolve, delay));
        return this.retryWithBackoff(operation, retryCount + 1);
      }

      throw error;
    }
  }

  async generateStory(settings: {
    ageGroup: string;
    duration: number;
    theme: string;
    language: string;
  }) {
    try {
      if (!this.isInitialized || !this.genAI) {
        await this.initialize();
      }

      if (!this.genAI) {
        throw new Error('Failed to initialize Gemini API. Please check your API key.');
      }

      const model = this.genAI.getGenerativeModel({ 
        model: "gemini-pro",
        generationConfig: {
          temperature: 0.9,
          topP: 1,
          topK: 40,
          maxOutputTokens: 8192,
        },
      });

      const prompt = `Create a unique and engaging ${settings.duration} minute bedtime story for children aged ${settings.ageGroup} with the theme: ${settings.theme}.
      The story should be in ${settings.language} language.
      Include elements that are:
      1. Age-appropriate and engaging for ${settings.ageGroup} year olds
      2. Related to the theme of ${settings.theme}
      3. Have a clear beginning, middle, and end
      4. Include descriptive language and dialogue
      5. Have a positive message or moral
      6. Be approximately ${settings.duration} minutes when read aloud
      
      Make sure this story is unique and different from previous ones.
      
      Write the story in plain text format. Start with the title, then add two empty lines, and then write the story content.
      Do not use any special formatting, markdown, or code blocks.`;

      const result = await this.retryWithBackoff(async () => {
        const response = await model.generateContent(prompt);
        return response.response.text();
      });
      
      // Extract title and content from the generated text
      const lines = result.split('\n');
      const title = lines[0]
        .replace(/^(Title:|\#|\*)/gi, '') // Remove title prefix
        .replace(/\*\*/g, '') // Remove asterisks
        .trim();
      const content = lines.slice(2).join('\n').trim();
      
      return {
        title: title || "Bedtime Story",
        content: content || result
      };
    } catch (error) {
      console.error("Error generating story with Gemini:", error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Failed to generate story. Please check your Gemini API key and try again.'
      );
    }
  }

  async generateResponse(message: string, language: string = 'en') {
    try {
      if (!this.isInitialized || !this.genAI) {
        await this.initialize();
      }

      if (!this.genAI) {
        throw new Error('Failed to initialize Gemini API. Please check your API key.');
      }

      const model = this.genAI.getGenerativeModel({ 
        model: "gemini-pro",
        generationConfig: {
          temperature: 0.7,
          topP: 1,
          topK: 40,
          maxOutputTokens: 4096,
        },
      });

      return await this.retryWithBackoff(async () => {
        const result = await model.generateContent(message);
        const response = await result.response;
        return response.text();
      });
    } catch (error) {
      console.error("Error generating response:", error);
      throw new Error(
        error instanceof Error 
          ? error.message 
          : 'Failed to generate response. Please check your Gemini API key and try again.'
      );
    }
  }
}

export const geminiService = new GeminiService();