import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, MessageSquare, List, Loader } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const getGenerateQuizText = (language: string) => {
  const texts: { [key: string]: string } = {
    en: "Generate Quiz",
    es: "Generar Cuestionario",
    ar: "إنشاء اختبار"
  };
  return texts[language] || texts['en'];
};

const getLoadingText = (language: string) => {
  const texts: { [key: string]: string } = {
    en: "Generating Quiz...",
    es: "Generando Cuestionario...",
    ar: "جاري إنشاء الاختبار..."
  };
  return texts[language] || texts['en'];
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
    <Card className="h-full flex flex-col bg-gradient-to-r from-blue-50 to-blue-100">
      <Tabs defaultValue="chat" className="flex-1 flex flex-col">
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
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                        : "bg-white"
                    }`}
                    style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}
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
              placeholder={getPlaceholderText(language)}
              onKeyPress={(e) => e.key === "Enter" && handleSend()}
              disabled={isLoading}
              className="bg-white/90"
              style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}
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
          <ScrollArea className="h-full">
            {quiz.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <p className="text-gray-600" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
                  {language === 'es' ? 'No hay cuestionario disponible.' : 
                   language === 'ar' ? 'لا يوجد اختبار متاح.' : 
                   'No quiz available yet.'}
                </p>
                <Button
                  onClick={onGenerateQuiz}
                  disabled={isGeneratingQuiz}
                  className="bg-gradient-to-r from-blue-500 to-blue-600"
                >
                  {isGeneratingQuiz ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      {getLoadingText(language)}
                    </>
                  ) : (
                    <>
                      <List className="w-4 h-4 mr-2" />
                      {getGenerateQuizText(language)}
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {quiz.map((question, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg space-y-3">
                    <h3 className="font-medium text-gray-800" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
                      {question.question}
                    </h3>
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => (
                        <Button
                          key={optionIndex}
                          variant="outline"
                          className="w-full justify-start text-left"
                          style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
}