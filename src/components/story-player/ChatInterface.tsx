import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mic, Send } from "lucide-react";
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
}

export function ChatInterface({
  messages,
  onSendMessage,
  onStartRecording,
  onStopRecording,
  isRecording,
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
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p>{message.content}</p>
                {message.audioUrl && (
                  <audio controls className="mt-2 w-full">
                    <source src={message.audioUrl} type="audio/mpeg" />
                  </audio>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t p-4 flex gap-2">
        <Input
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
          onKeyPress={(e) => e.key === "Enter" && handleSend()}
          className="flex-1"
        />
        <Button onClick={handleSend}>
          <Send className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          onClick={isRecording ? onStopRecording : onStartRecording}
          className={isRecording ? "bg-red-500 text-white" : ""}
        >
          <Mic className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}