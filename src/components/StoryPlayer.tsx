import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Pause, Play, SkipBack, Volume2, VolumeX, Mic, Send } from "lucide-react";
import type { StorySettings } from "./StoryOptions";
import { realtimeApi } from "@/services/realtimeApi";

interface StoryPlayerProps {
  settings: StorySettings;
  onBack: () => void;
}

export function StoryPlayer({ settings, onBack }: StoryPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [storyText, setStoryText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    if (settings.music) {
      try {
        audioRef.current = new Audio(`/assets/${settings.music}.mp3`);
        audioRef.current.loop = true;
        audioRef.current.volume = volume;
        
        audioRef.current.onerror = () => {
          console.error("Error loading audio file");
          setAudioError(true);
        };
      } catch (error) {
        console.error("Error creating audio element:", error);
        setAudioError(true);
      }
    }

    // Connect to OpenAI Realtime API
    wsRef.current = realtimeApi.connect();
    
    if (wsRef.current) {
      wsRef.current.onopen = () => {
        console.log("Connected to OpenAI Realtime API");
        if (wsRef.current) {
          // Start story generation when connection is established
          realtimeApi.generateStory(settings);
        }
      };

      wsRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === "conversation.item.created" && data.item.role === "assistant") {
          const content = data.item.content[0];
          if (content.type === "text") {
            setStoryText((prev) => prev + content.text);
          }
        }
      };

      wsRef.current.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      wsRef.current.onclose = () => {
        console.log("Disconnected from OpenAI Realtime API");
      };
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (wsRef.current) {
        realtimeApi.disconnect();
        wsRef.current = null;
      }
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [settings.music, volume, settings]);

  const toggleMusic = () => {
    if (!audioRef.current) return;
    
    if (isMusicPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
    setIsMusicPlaying(!isMusicPlaying);
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0 && wsRef.current) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64Audio = (reader.result as string).split(',')[1];
            realtimeApi.sendAudio(base64Audio);
          };
          reader.readAsDataURL(event.data);
        }
      };

      mediaRecorderRef.current.start(1000);
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const handleSendText = () => {
    if (wsRef.current && userInput.trim()) {
      realtimeApi.sendText(userInput.trim());
      setUserInput("");
    }
  };

  useEffect(() => {
    if (isPlaying) {
      if (settings.music && audioRef.current && !audioError) {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
          setAudioError(true);
        });
      }

      intervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            if (audioRef.current) {
              audioRef.current.pause();
            }
            return 100;
          }
          return prev + 100 / (settings.duration * 60);
        });
      }, 1000);
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, settings, audioError]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleVolumeChange = (newVolume: number[]) => {
    setVolume(newVolume[0]);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-8 animate-fade-in">
      <Card className="p-8 space-y-6">
        <div className="relative w-32 h-32 mx-auto animate-float">
          <div className="absolute inset-0 bg-story-purple rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute inset-2 bg-story-purple rounded-full opacity-40 animate-pulse [animation-delay:75ms]"></div>
          <div className="absolute inset-4 bg-story-purple rounded-full opacity-60 animate-pulse [animation-delay:150ms]"></div>
          <div className="absolute inset-6 bg-story-purple rounded-full opacity-80 animate-pulse [animation-delay:225ms]"></div>
        </div>

        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-semibold">Your Bedtime Story</h2>
          <p className="text-muted-foreground">
            Theme: {settings.theme} • Age: {settings.ageGroup} • Duration: {settings.duration}min • Voice: {settings.voice}
          </p>
          <div className="mt-4 text-left max-h-40 overflow-y-auto p-4 bg-muted rounded-lg">
            {storyText || "Your story will begin when you press play..."}
          </div>
        </div>

        <div className="flex gap-2">
          <Input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === 'Enter' && handleSendText()}
            className="flex-1"
          />
          <Button
            variant="outline"
            onClick={handleSendText}
            className="px-4"
          >
            <Send className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => isRecording ? stopRecording() : startRecording()}
            className={`rounded-full ${isRecording ? 'bg-red-500 hover:bg-red-600 text-white' : ''}`}
          >
            <Mic className="h-4 w-4" />
          </Button>
        </div>

        <div className="w-full bg-secondary rounded-full h-2">
          <div
            className="bg-story-purple h-2 rounded-full transition-all duration-1000"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {settings.music && !audioError && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleMusic}
                className="text-sm"
              >
                {isMusicPlaying ? "Stop Preview" : "Preview Music"}
              </Button>
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="rounded-full"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <Slider
                  value={[volume]}
                  max={1}
                  step={0.1}
                  onValueChange={handleVolumeChange}
                  className="w-32"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-center space-x-4">
          <Button
            variant="outline"
            size="icon"
            onClick={onBack}
            className="rounded-full"
          >
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            onClick={() => setIsPlaying(!isPlaying)}
            className="rounded-full w-12 h-12 bg-story-purple hover:bg-story-purple/90"
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-1" />}
          </Button>
        </div>
      </Card>
    </div>
  );
}