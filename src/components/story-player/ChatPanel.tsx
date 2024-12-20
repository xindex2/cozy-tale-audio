import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MessageSquare, List, Loader } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Quiz } from "./Quiz";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface ChatPanelProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
  quiz: QuizQuestion[];
  onGenerateQuiz: () => void;
  isGeneratingQuiz: boolean;
  language: string;
}

const getPlaceholderText = (language: string) => {
  const placeholders: { [key: string]: string } = {
    en: "Ask about the story...",
    es: "Pregunta sobre la historia...",
    ar: "اسأل عن القصة..."
  };
  return placeholders[language] || placeholders['en'];
};

export function ChatPanel({ 
  messages, 
  onSendMessage, 
  isLoading,
  quiz,
  onGenerateQuiz,
  isGeneratingQuiz,
  language
}: ChatPanelProps) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
    }
  };

  return (
    <Card className="h-[calc(100vh-24rem)] md:h-[calc(100vh-16rem)] mb-24 flex flex-col bg-gradient-to-r from-blue-50 to-blue-100">
      <Tabs defaultValue="chat" className="flex-1 flex flex-col h-full">
        <div className="p-4 border-b border-blue-100">
          <TabsList className="w-full bg-white/50">
            <TabsTrigger value="chat" className="flex-1">
              <MessageSquare className="w-4 h-4 mr-2" />
              {language === 'es' ? 'Chat' : language === 'ar' ? 'محادثة' : 'Chat'}
            </TabsTrigger>
            <TabsTrigger value="quiz" className="flex-1">
              <List className="w-4 h-4 mr-2" />
              {language === 'es' ? 'Cuestionario' : language === 'ar' ? 'اختبار' : 'Quiz'}
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="chat" className="flex-1 flex flex-col p-4 overflow-hidden">
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === "user"
                          ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                          : "bg-white"
                      }`}
                      style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}
                    >
                      {message.content}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="max-w-[80%] p-3 rounded-lg bg-white">
                    <div className="flex items-center space-x-2">
                      <Loader className="h-4 w-4 animate-spin text-blue-500" />
                      <span className="text-sm text-gray-500">Thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </ScrollArea>

          <div className="mt-4 flex gap-2 sticky bottom-0 bg-white/50 backdrop-blur-sm p-2 rounded-lg">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={getPlaceholderText(language)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              disabled={isLoading}
              className="bg-white/90"
              style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}
            />
            <Button 
              onClick={handleSend}
              disabled={isLoading}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="quiz" className="flex-1 p-4 overflow-hidden">
          <ScrollArea className="h-full">
            <Quiz 
              questions={quiz} 
              onRegenerateQuiz={onGenerateQuiz}
              language={language}
              isGenerating={isGeneratingQuiz}
            />
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
}