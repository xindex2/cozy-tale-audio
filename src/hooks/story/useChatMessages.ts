import { openaiService } from "@/services/apis/openai/storyGenerator";
import { useToast } from "@/hooks/use-toast";
import type { Message } from "@/types/story";

export function useChatMessages(state: ReturnType<typeof import("./useStoryState").useStoryState>) {
  const { toast } = useToast();

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
        { role: "assistant", content: response },
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

  return { handleSendMessage };
}