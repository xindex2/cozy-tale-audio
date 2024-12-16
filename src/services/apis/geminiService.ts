import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

class GeminiService {
  private genAI: GoogleGenerativeAI | null = null;
  private isInitialized = false;

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
      
      Format the response as a JSON object with 'title' and 'content' fields.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      try {
        const parsed = JSON.parse(text);
        return {
          title: parsed.title || "Bedtime Story",
          content: parsed.content || text
        };
      } catch {
        // If JSON parsing fails, create a structured response from the raw text
        const lines = text.split('\n');
        const title = lines[0].replace(/^(Title:|#|\*)/gi, '').trim();
        const content = lines.slice(1).join('\n').trim();
        
        return {
          title: title || "Bedtime Story",
          content: content || text
        };
      }
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

      const result = await model.generateContent(message);
      const response = await result.response;
      return response.text();
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