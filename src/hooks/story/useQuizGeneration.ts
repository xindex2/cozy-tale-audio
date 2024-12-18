import { openaiService } from "@/services/apis/openai/storyGenerator";
import { useToast } from "@/hooks/use-toast";

export function useQuizGeneration(state: ReturnType<typeof import("./useStoryState").useStoryState>) {
  const { toast } = useToast();

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
      const questions = JSON.parse(response);
      state.quiz.setQuestions(questions);
      
      toast({
        title: "Quiz Generated",
        description: "Test your knowledge about the story!",
      });
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

  return { generateQuiz };
}