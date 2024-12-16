import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

class GeminiService {
  private isInitialized = false;
  private perplexityKey: string | null = null;
  private elevenLabsKey: string | null = null;

  async initialize() {
    if (this.isInitialized) return;

    try {
      console.log("Fetching API keys...");
      const { data: perplexityData, error: perplexityError } = await supabase
        .from('api_keys')
        .select('key_value')
        .eq('key_name', 'PERPLEXITY_API_KEY')
        .eq('is_active', true)
        .single();

      const { data: elevenLabsData, error: elevenLabsError } = await supabase
        .from('api_keys')
        .select('key_value')
        .eq('key_name', 'ELEVEN_LABS_API_KEY')
        .eq('is_active', true)
        .single();

      if (perplexityError || !perplexityData?.key_value) {
        throw new Error('No active Perplexity API key found');
      }

      if (elevenLabsError || !elevenLabsData?.key_value) {
        throw new Error('No active ElevenLabs API key found');
      }

      this.perplexityKey = perplexityData.key_value;
      this.elevenLabsKey = elevenLabsData.key_value;
      this.isInitialized = true;
      console.log("Services initialized successfully");
    } catch (error) {
      console.error("Error initializing services:", error);
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
      if (!this.isInitialized) {
        await this.initialize();
      }

      const prompt = `Create a unique and engaging ${settings.duration} minute bedtime story for children aged ${settings.ageGroup} with the theme: ${settings.theme}.
      The story should be in ${settings.language} language.
      Include elements that are:
      1. Age-appropriate and engaging for ${settings.ageGroup} year olds
      2. Related to the theme of ${settings.theme}
      3. Have a clear beginning, middle, and end
      4. Include descriptive language and dialogue
      5. Have a positive message or moral
      6. Be approximately ${settings.duration} minutes when read aloud
      
      Format the response as a JSON object with 'title' and 'content' fields.`;

      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.perplexityKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a creative children\'s story writer. Format your response as a JSON object with title and content fields.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.statusText}`);
      }

      const result = await response.json();
      const storyText = result.choices[0].message.content;
      
      try {
        const parsed = JSON.parse(storyText);
        const audioUrl = await this.generateAudio(parsed.content);
        
        return {
          title: parsed.title || "Bedtime Story",
          content: parsed.content,
          audioUrl
        };
      } catch (parseError) {
        console.error("Error parsing story JSON:", parseError);
        const lines = storyText.split('\n');
        const title = lines[0].replace(/^(Title:|\#|\*)/gi, '').trim();
        const content = lines.slice(1).join('\n').trim();
        
        const audioUrl = await this.generateAudio(content);
        
        return {
          title: title || "Bedtime Story",
          content,
          audioUrl
        };
      }
    } catch (error) {
      console.error("Error generating story:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate story",
        variant: "destructive",
      });
      throw error;
    }
  }

  private async generateAudio(text: string): Promise<string> {
    try {
      const response = await fetch('https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM', {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'xi-api-key': this.elevenLabsKey!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate audio');
      }

      const audioBlob = await response.blob();
      return URL.createObjectURL(audioBlob);
    } catch (error) {
      console.error("Error generating audio:", error);
      toast({
        title: "Error",
        description: "Failed to generate audio. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  }

  async generateResponse(message: string, language: string = 'en') {
    try {
      if (!this.isInitialized) {
        await this.initialize();
      }

      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.perplexityKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant for children\'s stories.'
            },
            {
              role: 'user',
              content: message
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.statusText}`);
      }

      const result = await response.json();
      return result.choices[0].message.content;
    } catch (error) {
      console.error("Error generating response:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();