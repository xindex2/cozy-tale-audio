import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export class ApiKeyManager {
  private static instance: ApiKeyManager;
  private apiKey: string | null = null;

  private constructor() {}

  static getInstance(): ApiKeyManager {
    if (!ApiKeyManager.instance) {
      ApiKeyManager.instance = new ApiKeyManager();
    }
    return ApiKeyManager.instance;
  }

  async getApiKey(): Promise<string> {
    if (this.apiKey) return this.apiKey;

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
        toast({
          title: "Error",
          description: "Failed to fetch API key. Please check your configuration.",
          variant: "destructive",
        });
        throw new Error('Failed to fetch OpenAI API key');
      }

      if (!data?.key_value) {
        console.error("No active OpenAI API key found");
        toast({
          title: "Configuration Error",
          description: "No active OpenAI API key found. Please add one in the admin settings.",
          variant: "destructive",
        });
        throw new Error('No active OpenAI API key found');
      }

      this.apiKey = data.key_value;
      return this.apiKey;
    } catch (error) {
      console.error("Error in getApiKey:", error);
      throw error;
    }
  }

  clearApiKey() {
    this.apiKey = null;
  }
}