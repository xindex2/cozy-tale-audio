import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_MODEL, generationConfig } from "./config";
import { supabase } from "@/integrations/supabase/client";

class GeminiClient {
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

  async generateContent(prompt: string) {
    if (!this.isInitialized || !this.genAI) {
      await this.initialize();
    }

    const model = this.genAI!.getGenerativeModel({ 
      model: GEMINI_MODEL,
      generationConfig
    });

    const result = await model.generateContent(prompt);
    return result.response.text();
  }
}

export const geminiClient = new GeminiClient();