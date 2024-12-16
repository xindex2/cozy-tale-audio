import { useToast } from "@/hooks/use-toast";
import { openaiService } from "@/services/apis/openai/storyGenerator";
import { audioService } from "@/services/apis/audioService";
import type { StorySettings } from "@/components/StoryOptions";
import type { Message, QuizQuestion } from "@/types/story";

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
      const { title, content, audioUrl, backgroundMusicUrl } = await openaiService.generateStory(settings);
      
      state.story.setTitle(title);
      state.story.setContent(content);
      
      if (audioUrl) {
        state.audio.setCurrentAudioUrl(audioUrl);
      }
      
      if (backgroundMusicUrl) {
        state.audio.setCurrentMusicUrl(backgroundMusicUrl);
      }
      
      // Start playing automatically after generation
      state.playback.setIsPlaying(true);

      if (onSave) {
        onSave(
          title,
          content,
          audioUrl || "",
          backgroundMusicUrl || ""
        );
      }

      toast({
        title: "Story Generated",
        description: "Your story is ready to play!",
      });
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
    if (!state.story.content) {
      toast({
        title: "Error",
        description: "No story content available to generate quiz.",
        variant: "destructive",
      });
      return;
    }

    state.loading.setIsGeneratingQuiz(true);
    try {
      const prompt = `Generate a quiz about this story: ${state.story.content}
      Format the response as a JSON array of questions, each with:
      - question: the question text
      - options: array of 4 possible answers
      - correctAnswer: index of the correct answer (0-3)
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
    if (!text.trim() || !state.story.content) return;
    
    state.loading.setIsSending(true);
    try {
      const newMessage: Message = { role: "user", content: text };
      state.story.setMessages(prev => [...prev, newMessage]);
      
      const prompt = `You are a helpful assistant discussing this story: "${state.story.content}". 
      The user asks: "${text}"
      
      Provide a helpful, engaging response about the story's content, characters, themes, or moral lessons. 
      Keep the response focused on the story and appropriate for children.`;
      
      const response = await openaiService.generateContent(prompt, state.story.content);
      
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