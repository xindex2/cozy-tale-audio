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
}

export function ChatPanel({ 
  messages, 
  onSendMessage, 
  isLoading,
  quiz,
  onGenerateQuiz,
  isGeneratingQuiz
}: ChatPanelProps) {
  const [input, setInput] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showScore, setShowScore] = useState(false);
  const [score, setScore] = useState(0);

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput("");
    }
  };

  const handleQuizSubmit = () => {
    if (selectedAnswers.length === quiz.length) {
      const newScore = selectedAnswers.reduce((acc, answer, index) => {
        return acc + (answer === quiz[index].correctAnswer ? 1 : 0);
      }, 0);
      setScore(newScore);
      setShowScore(true);
    }
  };

  const resetQuiz = () => {
    setSelectedAnswers([]);
    setShowScore(false);
    setScore(0);
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
              <List className="w-4 h-4 mr-2" />
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
          <ScrollArea className="h-full">
            {quiz.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4">
                <p className="text-gray-600">No quiz available yet.</p>
                <Button
                  onClick={onGenerateQuiz}
                  disabled={isGeneratingQuiz}
                  className="bg-gradient-to-r from-blue-500 to-blue-600"
                >
                  {isGeneratingQuiz ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Generating Quiz...
                    </>
                  ) : (
                    <>
                      <List className="w-4 h-4 mr-2" />
                      Generate Quiz
                    </>
                  )}
                </Button>
              </div>
            ) : showScore ? (
              <div className="space-y-4">
                <div className="text-center p-4 bg-white rounded-lg">
                  <h3 className="text-xl font-bold text-blue-800">Quiz Complete!</h3>
                  <p className="text-lg mt-2">
                    Your score: {score} out of {quiz.length}
                  </p>
                </div>
                <Button
                  onClick={resetQuiz}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600"
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {quiz.map((question, qIndex) => (
                  <div key={qIndex} className="space-y-3">
                    <h3 className="font-medium text-gray-800">
                      {qIndex + 1}. {question.question}
                    </h3>
                    <div className="space-y-2">
                      {question.options.map((option, oIndex) => (
                        <Button
                          key={oIndex}
                          variant={selectedAnswers[qIndex] === oIndex ? "default" : "outline"}
                          className="w-full justify-start text-left"
                          onClick={() => {
                            const newAnswers = [...selectedAnswers];
                            newAnswers[qIndex] = oIndex;
                            setSelectedAnswers(newAnswers);
                          }}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
                <Button
                  onClick={handleQuizSubmit}
                  disabled={selectedAnswers.length !== quiz.length}
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600"
                >
                  Submit Answers
                </Button>
              </div>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  );
}