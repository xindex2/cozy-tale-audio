import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

class OpenAIClient {
  private isInitialized = false;
  private apiKey: string | null = null;

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

      this.apiKey = data.key_value;
      this.isInitialized = true;
      console.log("OpenAI client initialized successfully");
    } catch (error) {
      console.error("Error initializing OpenAI client:", error);
      this.isInitialized = false;
      throw error;
    }
  }

  async generateContent(prompt: string) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    try {
      console.log("Generating content with prompt:", prompt);
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: 'You are a helpful assistant that generates children\'s stories.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to generate content');
      }

      const data = await response.json();
      return data.choices[0].message.content;
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