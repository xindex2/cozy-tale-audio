import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pause, Play, SkipBack, Loader } from "lucide-react";
import type { StorySettings } from "./StoryOptions";
import { aiService } from "@/services/aiService";
import { ChatInterface } from "./story-player/ChatInterface";
import { AudioControls } from "./story-player/AudioControls";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
  audioUrl?: string;
}

export function StoryPlayer({ settings, onBack }: { settings: StorySettings; onBack: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    startStory();
  }, []);

  const startStory = async () => {
    setIsLoading(true);
    try {
      const { text, audioUrl } = await aiService.startChat(settings);
      
      setMessages([{ role: "assistant", content: text, audioUrl }]);
      if (audioUrl) {
        setCurrentAudioUrl(audioUrl);
      }
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
      
      const { text: responseText, audioUrl } = await aiService.continueStory(text);
      
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: responseText, audioUrl },
      ]);
      if (audioUrl) {
        setCurrentAudioUrl(audioUrl);
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

  useEffect(() => {
    if (currentAudioUrl) {
      audioRef.current = new Audio(currentAudioUrl);
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current.play().catch(console.error);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [currentAudioUrl, volume, isMuted]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume[0]);
    if (audioRef.current) {
      audioRef.current.volume = newVolume[0];
    }
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? volume : 0;
    }
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
      <Card className="p-8 space-y-6 bg-white/90 backdrop-blur-sm">
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

        <div className="h-[400px] bg-gray-50/50 rounded-lg">
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            isRecording={isRecording}
            isSending={isSending}
          />
        </div>

        <div className="flex justify-center">
          <Button
            size="icon"
            onClick={togglePlay}
            className="rounded-full w-12 h-12 bg-story-purple hover:bg-story-purple/90"
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
