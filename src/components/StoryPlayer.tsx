import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pause, Play, SkipBack, Loader } from "lucide-react";
import type { StorySettings } from "./StoryOptions";
import { aiService } from "@/services/aiService";
import { ChatInterface } from "./story-player/ChatInterface";
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

export function StoryPlayer({ settings, onBack }: { settings: StorySettings; onBack: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
  const [currentMusicUrl, setCurrentMusicUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Prompt for ElevenLabs API key if not set
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
      const { text, audioUrl, backgroundMusicUrl } = await aiService.startChat(settings);
      
      setMessages([{ 
        role: "assistant", 
        content: text, 
        audioUrl,
        backgroundMusicUrl 
      }]);
      
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

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: "audio/wav" });
        setMessages((prev) => [
          ...prev,
          { 
            role: "user", 
            content: "Audio message",
            audioUrl: URL.createObjectURL(audioBlob)
          },
        ]);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        title: "Error",
        description: "Failed to start recording. Please check your microphone permissions.",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume[0]);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto p-6 animate-fade-in">
        <Card className="p-8 flex flex-col items-center justify-center min-h-[400px]">
          <Loader className="h-8 w-8 animate-spin text-story-purple mb-4" />
          <p className="text-muted-foreground">Creating your story...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8 animate-fade-in">
      <Card className="p-8 space-y-6 bg-gradient-to-r from-blue-50 to-blue-100 backdrop-blur-sm border border-blue-200">
        <div className="flex justify-between items-center">
          <Button variant="outline" size="icon" onClick={onBack}>
            <SkipBack className="h-4 w-4" />
          </Button>
          <AudioControls
            volume={volume}
            isMuted={isMuted}
            onVolumeChange={handleVolumeChange}
            onToggleMute={toggleMute}
          />
        </div>

        <div className="h-[400px] bg-white/50 rounded-lg overflow-hidden border border-blue-100">
          {messages.map((message, index) => (
            <div key={index} className="mb-4">
              <StoryDisplay
                text={message.content}
                audioUrl={message.audioUrl}
                isPlaying={isPlaying}
              />
            </div>
          ))}
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            isRecording={isRecording}
            isSending={isSending}
          />
        </div>

        <AudioManager
          voiceUrl={currentAudioUrl}
          backgroundMusicUrl={currentMusicUrl}
          isPlaying={isPlaying}
          volume={volume}
          isMuted={isMuted}
        />

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
  );
}
