import { useToast } from "@/hooks/use-toast";
import { openaiService } from "@/services/apis/openai/storyGenerator";
import { audioService } from "@/services/apis/audioService";
import type { StorySettings } from "@/components/StoryOptions";
import type { Message } from "@/types/story";

export function useStoryActions(
  state: ReturnType<typeof import("./useStoryState").useStoryState>,
  onSave?: (title: string, content: string, audioUrl: string, backgroundMusicUrl: string) => void
) {
  const { toast } = useToast();

  const startStory = async (settings: StorySettings) => {
    state.loading.setIsLoading(true);
    state.loading.setStage('text');
    try {
      console.log("Starting story generation with settings:", settings);
      const { title, content } = await openaiService.generateStory(settings);
      
      state.story.setTitle(title);
      state.story.setContent(content);
      
      // Set background music if selected
      if (settings.music !== 'no-music') {
        state.loading.setStage('music');
        const musicUrl = audioService.getBackgroundMusicUrl(settings.music);
        if (musicUrl) {
          state.audio.setCurrentMusicUrl(musicUrl);
        }
      }
      
      // Start playing automatically after generation
      state.playback.setIsPlaying(true);

      if (onSave) {
        onSave(
          title,
          content,
          state.audio.currentAudioUrl || "",
          state.audio.currentMusicUrl || ""
        );
      }
    } catch (error) {
      console.error("Error starting story:", error);
      toast({
        title: "Story Generation Error",
        description: error instanceof Error ? error.message : "Failed to generate story. Please try again.",
        variant: "destructive",
      });
    } finally {
      state.loading.setIsLoading(false);
    }
  };

  const generateQuiz = async () => {
    state.loading.setIsGeneratingQuiz(true);
    try {
      const prompt = `Generate a quiz about this story: ${state.story.content}
      Format the response as a JSON array of questions, each with:
      - question: the question text
      - options: array of 4 possible answers
      - correct: index of the correct answer (0-3)
      Make questions appropriate for children and focus on reading comprehension.`;

      const response = await openaiService.generateContent(prompt);
      try {
        const questions = JSON.parse(response);
        state.quiz.setQuestions(questions);
        toast({
          title: "Quiz Generated",
          description: "Test your knowledge about the story!",
        });
      } catch (error) {
        console.error("Error parsing quiz response:", error);
        throw new Error("Failed to parse quiz questions");
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
      toast({
        title: "Error",
        description: "Failed to generate quiz. Please try again.",
        variant: "destructive",
      });
    } finally {
      state.loading.setIsGeneratingQuiz(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    state.loading.setIsSending(true);
    try {
      const newMessage: Message = { role: "user", content: text };
      state.story.setMessages(prev => [...prev, newMessage]);
      
      const response = await openaiService.generateContent(text);
      
      state.story.setMessages(prev => [
        ...prev,
        { 
          role: "assistant", 
          content: response
        },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to process your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      state.loading.setIsSending(false);
    }
  };

  return {
    startStory,
    generateQuiz,
    handleSendMessage
  };
}