import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pause, Play, SkipBack, Loader, BookOpen, List } from "lucide-react";
import type { StorySettings } from "./StoryOptions";
import { aiService } from "@/services/aiService";
import { ChatPanel } from "./story-player/ChatPanel";
import { AudioControls } from "./story-player/AudioControls";
import { AudioManager } from "./story-player/AudioManager";
import { StoryDisplay } from "./story-player/StoryDisplay";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
  audioUrl?: string;
  backgroundMusicUrl?: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export function StoryPlayer({ settings, onBack }: { settings: StorySettings; onBack: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
  const [currentMusicUrl, setCurrentMusicUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [storyTitle, setStoryTitle] = useState("");
  const [storyContent, setStoryContent] = useState("");
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const apiKey = prompt("Please enter your ElevenLabs API key:");
    if (apiKey) {
      aiService.setApiKey(apiKey);
      startStory();
    } else {
      toast({
        title: "API Key Required",
        description: "An ElevenLabs API key is required for voice generation.",
        variant: "destructive",
      });
    }
  }, []);

  const startStory = async () => {
    setIsLoading(true);
    try {
      const { text, audioUrl, backgroundMusicUrl, title } = await aiService.startChat(settings);
      setStoryTitle(title || "Your Bedtime Story");
      setStoryContent(text);
      
      if (audioUrl) {
        setCurrentAudioUrl(audioUrl);
      }
      if (backgroundMusicUrl) {
        setCurrentMusicUrl(backgroundMusicUrl);
      }
      setIsPlaying(true);
    } catch (error) {
      console.error("Error starting story:", error);
      toast({
        title: "Error",
        description: "Failed to start the story. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateQuiz = async () => {
    setIsGeneratingQuiz(true);
    try {
      // Mock quiz generation - in real app, this would call an AI service
      const questions: QuizQuestion[] = [
        {
          question: "What is the main character's goal in the story?",
          options: ["To find treasure", "To make friends", "To save the kingdom", "To learn magic"],
          correctAnswer: 2
        },
        {
          question: "Where does the story take place?",
          options: ["In a castle", "In a forest", "In a city", "In space"],
          correctAnswer: 0
        },
        {
          question: "What is the main challenge faced by the character?",
          options: ["A dragon", "A storm", "A riddle", "A curse"],
          correctAnswer: 3
        },
        {
          question: "Who helps the main character?",
          options: ["A wizard", "A fairy", "A talking animal", "A friendly ghost"],
          correctAnswer: 1
        },
        {
          question: "How does the story end?",
          options: ["With a celebration", "With a lesson learned", "With a new beginning", "With a mystery solved"],
          correctAnswer: 1
        }
      ];
      setQuiz(questions);
      toast({
        title: "Quiz Generated",
        description: "Test your knowledge about the story!",
      });
    } catch (error) {
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
    setIsSending(true);
    try {
      setMessages((prev) => [...prev, { role: "user", content: text }]);
      
      const { text: responseText, audioUrl, backgroundMusicUrl } = await aiService.continueStory(text);
      
      setMessages((prev) => [
        ...prev,
        { 
          role: "assistant", 
          content: responseText, 
          audioUrl,
          backgroundMusicUrl 
        },
      ]);
      
      if (audioUrl) {
        setCurrentAudioUrl(audioUrl);
      }
      if (backgroundMusicUrl) {
        setCurrentMusicUrl(backgroundMusicUrl);
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

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6 animate-fade-in">
        <Card className="p-8 flex flex-col items-center justify-center min-h-[400px] bg-gradient-to-r from-blue-50 to-blue-100">
          <Loader className="h-8 w-8 animate-spin text-blue-500 mb-4" />
          <p className="text-blue-600">Creating your story...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto p-4 lg:p-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Story Section - Takes up 2/3 of the space on desktop */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-4 lg:p-8 space-y-6 bg-gradient-to-r from-blue-50 to-blue-100 backdrop-blur-sm border border-blue-200">
            <div className="flex justify-between items-center">
              <Button variant="outline" size="icon" onClick={onBack}>
                <SkipBack className="h-4 w-4" />
              </Button>
              <h1 className="text-xl lg:text-2xl font-bold text-blue-800">{storyTitle}</h1>
              <AudioControls
                volume={volume}
                isMuted={isMuted}
                onVolumeChange={(newVolume) => setVolume(newVolume[0])}
                onToggleMute={() => setIsMuted(!isMuted)}
              />
            </div>

            <AudioManager
              voiceUrl={currentAudioUrl}
              backgroundMusicUrl={currentMusicUrl}
              isPlaying={isPlaying}
              volume={volume}
              isMuted={isMuted}
            />

            <div className="prose prose-blue max-w-none">
              {storyContent.split('\n').map((paragraph, index) => (
                <p key={index} className="text-gray-800 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="flex justify-center">
              <Button
                size="icon"
                onClick={() => setIsPlaying(!isPlaying)}
                className="rounded-full w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 ml-1" />
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Chat/Quiz Section - Takes up 1/3 of the space on desktop */}
        <div className="h-[600px] lg:h-[800px]">
          <ChatPanel
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isSending}
            quiz={quiz}
            onGenerateQuiz={generateQuiz}
            isGeneratingQuiz={isGeneratingQuiz}
          />
        </div>
      </div>
    </div>
  );
}