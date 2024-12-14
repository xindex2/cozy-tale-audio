import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Pause, Play, SkipBack } from "lucide-react";
import type { StorySettings } from "./StoryOptions";
import { aiService } from "@/services/aiService";
import { ChatInterface } from "./story-player/ChatInterface";
import { AudioControls } from "./story-player/AudioControls";
import { useToast } from "@/components/ui/use-toast";

interface StoryPlayerProps {
  settings: StorySettings;
  onBack: () => void;
}

interface Message {
  role: "user" | "assistant";
  content: string;
  audioUrl?: string;
}

export function StoryPlayer({ settings, onBack }: StoryPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    startStory();
  }, []);

  const startStory = async () => {
    try {
      const storyText = await aiService.startChat(settings);
      const audioUrl = await aiService.generateSpeech(storyText, settings.voice);
      
      setMessages([{ role: "assistant", content: storyText, audioUrl }]);
      setCurrentAudioUrl(audioUrl);
    } catch (error) {
      console.error("Error starting story:", error);
      toast({
        title: "Error",
        description: "Failed to start the story. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async (text: string) => {
    try {
      setMessages((prev) => [...prev, { role: "user", content: text }]);
      
      const response = await aiService.continueStory(text);
      const audioUrl = await aiService.generateSpeech(response, settings.voice);
      
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response, audioUrl },
      ]);
      setCurrentAudioUrl(audioUrl);
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "Failed to process your message. Please try again.",
        variant: "destructive",
      });
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
        // Here you would typically send this blob to a speech-to-text service
        // For now, we'll just add it as a message
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
      
      if (isPlaying) {
        audioRef.current.play().catch(console.error);
      }
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [currentAudioUrl, isPlaying, volume, isMuted]);

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

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8 animate-fade-in">
      <Card className="p-8 space-y-6">
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

        <div className="h-[400px]">
          <ChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            isRecording={isRecording}
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