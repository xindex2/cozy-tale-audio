import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Send, Loader } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "user" | "assistant";
  content: string;
  audioUrl?: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  onStartRecording: () => void;
  onStopRecording: () => void;
  isRecording: boolean;
  isSending: boolean;
}

export function ChatInterface({
  messages,
  onSendMessage,
  onStartRecording,
  onStopRecording,
  isRecording,
  isSending,
}: ChatInterfaceProps) {
  const [userInput, setUserInput] = useState("");

  const handleSend = () => {
    if (userInput.trim()) {
      onSendMessage(userInput);
      setUserInput("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-lg shadow-md ${
                  message.role === "user"
                    ? "bg-story-purple text-white"
                    : "bg-white border border-gray-200"
                }`}
              >
                <p className="text-base leading-relaxed whitespace-pre-wrap">
                  {message.content}
                </p>
                {message.audioUrl && (
                  <audio
                    controls
                    autoPlay
                    className="mt-2 w-full"
                    key={message.audioUrl}
                  >
                    <source src={message.audioUrl} type="audio/mpeg" />
                  </audio>
                )}
              </div>
            </div>
          ))}
          {isSending && (
            <div className="flex justify-start">
              <div className="max-w-[80%] p-4 rounded-lg bg-white border border-gray-200">
                <div className="flex items-center space-x-2">
                  <Loader className="h-4 w-4 animate-spin text-story-purple" />
                  <span className="text-sm text-muted-foreground">
                    Thinking...
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="border-t p-4 flex gap-2 bg-white/50 backdrop-blur-sm">
        <Input
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          className="flex-1"
          disabled={isSending}
        />
        <Button onClick={handleSend} disabled={isSending}>
          {isSending ? (
            <Loader className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="outline"
          onClick={isRecording ? onStopRecording : onStartRecording}
          className={isRecording ? "bg-red-500 text-white" : ""}
          disabled={isSending}
        >
          <Mic className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}