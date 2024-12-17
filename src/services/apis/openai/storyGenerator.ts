import { openaiClient } from "./openaiClient";
import type { StoryGenerationSettings, StoryResponse } from "./types";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const openaiService = {
  async generateStory(settings: StoryGenerationSettings): Promise<StoryResponse> {
    try {
      console.log("Starting story generation with settings:", settings);
      
      const systemPrompt = `You are a professional storyteller who writes ONLY in ${settings.language}. 
      Important rules:
      1. Write EVERYTHING in ${settings.language} only, including numbers and measurements
      2. Use proper grammar, punctuation, and formatting for ${settings.language}
      3. Never mix languages or include any English text
      4. Ensure the story flows naturally with appropriate sentence structure
      5. Include proper punctuation marks according to ${settings.language} rules
      6. ALWAYS format your response exactly like this, with these exact English labels followed by the content in the target language:
         TITLE: [Story Title in ${settings.language}]
         CONTENT: [Story Content in ${settings.language}]`;
      
      const userPrompt = `Create an engaging story with these specifications:
      - Duration: ${settings.duration} minutes
      - Age group: ${settings.ageGroup}
      - Theme: ${settings.theme}
      
      Requirements:
      1. Write a complete, coherent story
      2. Use age-appropriate language and themes
      3. Include proper dialogue and descriptions
      4. Maintain consistent narrative flow
      5. Use appropriate punctuation and grammar
      
      Remember to format your response exactly as:
      TITLE: [Story Title]
      CONTENT: [Story Content]`;

      let title = '';
      let content = '';
      let buffer = '';

      const response = await openaiClient.generateContent(
        userPrompt, 
        systemPrompt,
        (chunk) => {
          buffer += chunk;
          
          // Try to extract title and content from the buffer
          const titleMatch = buffer.match(/TITLE:\s*(.*?)(?=\s*\n+\s*CONTENT:)/s);
          const contentMatch = buffer.match(/CONTENT:\s*([\s\S]*$)/s);
          
          if (titleMatch && !title) {
            title = titleMatch[1].trim();
            console.log("Title extracted:", title);
          }
          
          if (contentMatch) {
            content = contentMatch[1].trim();
          }
        }
      );

      console.log("Story generation completed");

      // Only proceed with audio generation if audio is enabled
      if (settings.audio) {
        toast({
          title: "Generating Audio",
          description: "Please wait while we create the audio narration...",
        });

        // Get the ElevenLabs API key
        const { data: apiKeyData, error: apiKeyError } = await supabase
          .from('api_keys')
          .select('key_value')
          .eq('key_name', 'ELEVEN_LABS_API_KEY')
          .eq('is_active', true)
          .single();

        if (apiKeyError || !apiKeyData) {
          console.error("Error fetching ElevenLabs API key:", apiKeyError);
          throw new Error("ElevenLabs API key not found");
        }

        // Generate audio using ElevenLabs
        const voiceId = settings.voice || "21m00Tcm4TlvDq8ikWAM";
        const audioResponse = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
          method: 'POST',
          headers: {
            'Accept': 'audio/mpeg',
            'Content-Type': 'application/json',
            'xi-api-key': apiKeyData.key_value
          },
          body: JSON.stringify({
            text: content,
            model_id: "eleven_multilingual_v2",
            voice_settings: {
              stability: 0.5,
              similarity_boost: 0.5
            }
          })
        });

        if (!audioResponse.ok) {
          throw new Error(`ElevenLabs API error: ${audioResponse.statusText}`);
        }

        const audioBlob = await audioResponse.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        console.log("Audio generated successfully:", audioUrl);

        toast({
          title: "Audio Ready",
          description: "Your story's audio narration is ready to play!",
        });

        return {
          title,
          content,
          audioUrl,
          backgroundMusicUrl: settings.music ? `/assets/${settings.music}.mp3` : null
        };
      }

      // Return without audio if audio is disabled
      return {
        title,
        content,
        audioUrl: null,
        backgroundMusicUrl: settings.music ? `/assets/${settings.music}.mp3` : null
      };
    } catch (error) {
      console.error("Error generating story:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate story",
        variant: "destructive",
      });
      throw error;
    }
  },

  async generateQuiz(storyContent: string, language: string = 'en'): Promise<string> {
    try {
      const systemPrompt = `You are a quiz creator who works ONLY in ${language}. 
      Create engaging, age-appropriate questions about the story.
      All questions, answers, and explanations MUST be in ${language} only.`;

      const prompt = `Create a quiz about this story: ${storyContent}
      Rules:
      1. Write everything in ${language} only
      2. Create 5-7 multiple choice questions
      3. Make questions clear and age-appropriate
      4. Focus on reading comprehension
      5. Include proper grammar and punctuation
      
      Format the response as a JSON array with:
      - question: the question text
      - options: array of 4 possible answers
      - correctAnswer: index of correct answer (0-3)`;

      return await openaiClient.generateContent(prompt, systemPrompt);
    } catch (error) {
      console.error("Error generating quiz:", error);
      throw error;
    }
  },

  async generateContent(prompt: string, storyContext?: string): Promise<string> {
    try {
      const fullPrompt = storyContext 
        ? `Based on this story: "${storyContext}"\n\n${prompt}`
        : prompt;
        
      const response = await openaiClient.generateContent(fullPrompt);
      return response;
    } catch (error) {
      console.error("Error generating content:", error);
      throw error;
    }
  }
};
