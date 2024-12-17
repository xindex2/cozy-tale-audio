import { useToast } from "@/hooks/use-toast";
import { openaiService } from "@/services/apis/openai/storyGenerator";
import { audioService } from "@/services/audioService";
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
    state.story.setContent(""); 
    state.story.setTitle("");
    
    try {
      console.log("Starting story generation with settings:", settings);
      
      const systemPrompt = `You are a professional storyteller. 
      Create a story that is exactly ${settings.duration} minutes long when read aloud.
      Format your response exactly as:
      TITLE: [Story Title]
      CONTENT: [Story Content]`;

      const userPrompt = `Create an engaging ${settings.theme} story for ${settings.ageGroup} year olds.
      The story should be appropriate for the age group and last ${settings.duration} minutes when read aloud.
      Make it creative and engaging.`;

      toast({
        title: "Generating Story",
        description: "Creating your story...",
      });

      const response = await openaiService.generateContent(userPrompt, systemPrompt);
      
      // Extract title and content
      const titleMatch = response.match(/TITLE:\s*(.*?)(?=\s*\n+\s*CONTENT:)/s);
      const contentMatch = response.match(/CONTENT:\s*([\s\S]*$)/s);
      
      if (titleMatch && contentMatch) {
        const title = titleMatch[1].trim();
        const content = contentMatch[1].trim();
        
        state.story.setTitle(title);
        state.story.setContent(content);
        
        toast({
          title: "Story Created",
          description: "Generating audio narration...",
        });

        // Generate audio if voice is enabled
        if (settings.voice !== 'none') {
          state.loading.setStage('audio');
          const audioUrl = await audioService.generateAudio(content);
          state.audio.setCurrentAudioUrl(audioUrl);
        }

        // Set background music if specified
        if (settings.music && settings.music !== 'no-music') {
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

        toast({
          title: "Story Ready",
          description: "Your story is ready to play!",
        });
      } else {
        throw new Error("Failed to parse story response");
      }
    } catch (error) {
      console.error("Error starting story:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate story",
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
