import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, MessageSquare, BrainCircuit } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Quiz } from "./Quiz";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export function ChatPanel({ messages, onSendMessage, isLoading }: ChatPanelProps) {
  const [input, setInput] = useState("");
  
  // Sample quiz questions (in real app, these would be generated based on the story)
  const sampleQuestions = [
    {
      question: "What was the main character's goal in the story?",
      options: ["To find treasure", "To make friends", "To save the kingdom", "To learn magic"],
      correctAnswer: 2
    },
    {
      question: "Where did the story take place?",
      options: ["In a castle", "In a forest", "In a city", "In space"],
      correctAnswer: 0
    }
  ];

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
    }
  };

  return (
    <Card className="h-full flex flex-col bg-gradient-to-r from-blue-50 to-blue-100">
      <Tabs defaultValue="chat" className="flex-1 flex flex-col">
        <div className="p-4 border-b border-blue-100">
          <TabsList className="w-full bg-white/50">
            <TabsTrigger value="chat" className="flex-1">
              <MessageSquare className="w-4 h-4 mr-2" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex-1">
              <BrainCircuit className="w-4 h-4 mr-2" />
              Quiz
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chat" className="flex-1 flex flex-col p-4">
          <ScrollArea className="flex-1">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-white"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="mt-4 flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about the story..."
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              disabled={isLoading}
              className="bg-white/90"
            />
            <Button 
              onClick={handleSend}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="quiz" className="flex-1 p-4">
          <Quiz questions={sampleQuestions} />
        </TabsContent>
      </Tabs>
    </Card>
  );
}