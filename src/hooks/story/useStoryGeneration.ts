import { openaiService } from "@/services/apis/openai/storyGenerator";
import { audioService } from "@/services/audioService";
import type { StorySettings } from "@/components/StoryOptions";
import { useToast } from "@/hooks/use-toast";
import { getToastMessage } from "./toastMessages";

export function useStoryGeneration(state: ReturnType<typeof import("./useStoryState").useStoryState>) {
  const { toast } = useToast();

  const generateStory = async (settings: StorySettings) => {
    state.loading.setIsLoading(true);
    state.loading.setStage('text');
    
    try {
      console.log("Starting story generation with settings:", settings);
      
      toast({
        title: getToastMessage("generating", settings.language),
        duration: 5000,
      });

      const response = await openaiService.generateContent(
        `Create an engaging ${settings.theme} story for ${settings.ageGroup} year olds that lasts ${settings.duration} minutes when read aloud.`,
        `You are a professional storyteller who writes ONLY in ${settings.language}. 
        Important rules:
        1. Write EVERYTHING in ${settings.language} only
        2. Use proper grammar and punctuation for ${settings.language}
        3. Never mix languages or include any English text
        4. Format your response exactly as:
        TITLE: [Story Title in ${settings.language}]
        CONTENT: [Story Content in ${settings.language}]`
      );
      
      const titleMatch = response.match(/TITLE:\s*(.*?)(?=\s*\n+\s*CONTENT:)/s);
      const contentMatch = response.match(/CONTENT:\s*([\s\S]*$)/s);
      
      if (titleMatch && contentMatch) {
        const title = titleMatch[1].trim();
        const content = contentMatch[1].trim();
        
        state.story.setTitle(title);
        state.story.setContent(content);

        if (settings.voice !== 'none') {
          state.loading.setStage('audio');
          toast({
            title: getToastMessage("audioGenerating", settings.language),
            duration: 5000,
          });
          const audioUrl = await audioService.generateAudio(content);
          state.audio.setCurrentAudioUrl(audioUrl);
        }

        if (settings.music && settings.music !== 'no-music') {
          state.loading.setStage('music');
          const musicUrl = audioService.getBackgroundMusicUrl(settings.music);
          if (musicUrl) {
            state.audio.setCurrentMusicUrl(musicUrl);
          }
        }

        state.playback.setIsPlaying(true);

        toast({
          title: getToastMessage("ready", settings.language),
          duration: 3000,
        });

        return { title, content };
      } else {
        throw new Error("Failed to parse story response");
      }
    } catch (error) {
      console.error("Error starting story:", error);
      toast({
        title: getToastMessage("error", settings.language),
        description: error instanceof Error ? error.message : "Failed to generate story",
        variant: "destructive",
        duration: 5000,
      });
      return null;
    } finally {
      state.loading.setIsLoading(false);
    }
  };

  return { generateStory };
}