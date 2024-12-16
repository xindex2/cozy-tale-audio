import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { aiService } from "@/services/aiService";
import type { StorySettings } from "@/components/StoryOptions";
import type { Message, QuizQuestion } from "@/types/story";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

export function useStoryPlayer(settings: StorySettings, onSave?: (title: string, content: string, audioUrl: string, backgroundMusicUrl: string) => void) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [musicVolume, setMusicVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
  const [currentMusicUrl, setCurrentMusicUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [storyTitle, setStoryTitle] = useState("");
  const [storyContent, setStoryContent] = useState("");
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const { toast } = useToast();

  // Fetch and initialize Gemini API key
  useQuery({
    queryKey: ['gemini-api-key'],
    queryFn: async () => {
      try {
        console.log("Fetching Gemini API key...");
        const { data, error } = await supabase
          .from('api_keys')
          .select('key_value')
          .eq('key_name', 'GEMINI_API_KEY')
          .single();

        if (error) {
          console.error('Error fetching Gemini API key:', error);
          throw new Error('Failed to fetch Gemini API key');
        }

        if (!data?.key_value) {
          console.error('No Gemini API key found');
          throw new Error('Gemini API key not found');
        }

        console.log("Initializing Gemini API...");
        aiService.setGeminiApiKey(data.key_value);
        console.log("Gemini API initialized successfully");
        
        return data.key_value;
      } catch (error) {
        console.error('Failed to initialize Gemini API:', error);
        throw error;
      }
    },
    retry: 2,
    staleTime: Infinity,
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to initialize story generation. Please check API key in admin dashboard.",
        variant: "destructive",
      });
    }
  });

  const startStory = async () => {
    setIsLoading(true);
    try {
      console.log("Starting story generation...");
      const { text, audioUrl, backgroundMusicUrl, title } = await aiService.startChat(settings);
      console.log("Story generated successfully");
      
      setStoryTitle(title || "Your Bedtime Story");
      setStoryContent(text);
      
      if (audioUrl) {
        setCurrentAudioUrl(audioUrl);
      }
      if (backgroundMusicUrl) {
        setCurrentMusicUrl(backgroundMusicUrl);
      }
      setIsPlaying(true);

      if (onSave) {
        onSave(title || "Your Bedtime Story", text, audioUrl || "", backgroundMusicUrl || "");
      }
    } catch (error) {
      console.error("Error starting story:", error);
      toast({
        title: "Error",
        description: "Failed to generate story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateQuiz = async () => {
    setIsGeneratingQuiz(true);
    try {
      const questions = await aiService.generateQuiz(storyContent, settings.language);
      setQuiz(questions);
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
      setIsGeneratingQuiz(false);
    }
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    setIsSending(true);
    try {
      setMessages((prev) => [...prev, { role: "user", content: text }]);
      
      const response = await aiService.continueStory(text, settings.language);
      
      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          content: response.text, 
          audioUrl: response.audioUrl,
          backgroundMusicUrl: response.backgroundMusicUrl 
        },
      ]);
      
      if (response.audioUrl) {
        setCurrentAudioUrl(response.audioUrl);
      }
      if (response.backgroundMusicUrl) {
        setCurrentMusicUrl(response.backgroundMusicUrl);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to process your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  return {
    isPlaying,
    setIsPlaying,
    volume,
    setVolume,
    musicVolume,
    setMusicVolume,
    isMuted,
    setIsMuted,
    isMusicMuted,
    setIsMusicMuted,
    messages,
    currentAudioUrl,
    currentMusicUrl,
    isLoading,
    isSending,
    storyTitle,
    storyContent,
    quiz,
    isGeneratingQuiz,
    currentTime,
    setCurrentTime,
    startStory,
    generateQuiz,
    handleSendMessage,
  };
}
