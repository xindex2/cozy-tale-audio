import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, RefreshCw } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizProps {
  questions: Question[];
  onRegenerateQuiz: () => void;
}

export function Quiz({ questions, onRegenerateQuiz }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const handleAnswerClick = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    // Move to next question after a delay
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
      } else {
        setShowScore(true);
      }
    }, 1500);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
  };

  if (!questions.length) {
    return (
      <Card className="p-6 text-center">
        <p className="text-gray-600">No quiz available for this story yet.</p>
        <Button onClick={onRegenerateQuiz} className="mt-4">
          <RefreshCw className="w-4 h-4 mr-2" />
          Generate Quiz
        </Button>
      </Card>
    );
  }

  if (showScore) {
    return (
      <Card className="p-6 text-center">
        <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
        <p className="text-xl mb-4">
          Your score: {score} out of {questions.length}
        </p>
        <div className="space-x-4">
          <Button onClick={resetQuiz}>
            Try Again
          </Button>
          <Button onClick={onRegenerateQuiz} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            New Quiz
          </Button>
        </div>
      </Card>
    );
  }

  const question = questions[currentQuestion];

  return (
    <Card className="p-6">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Question {currentQuestion + 1} of {questions.length}
          </h3>
        </div>
        <p className="text-gray-700 mb-4">{question.question}</p>
      </div>
      <div className="space-y-2">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index;
          const isCorrect = index === question.correctAnswer;
          const showResult = selectedAnswer !== null;

          return (
            <Button
              key={index}
              onClick={() => handleAnswerClick(index)}
              disabled={selectedAnswer !== null}
              variant={showResult 
                ? isCorrect 
                  ? "default"
                  : isSelected 
                    ? "destructive"
                    : "outline"
                : "outline"
              }
              className={`w-full justify-start text-left transition-colors ${
                showResult && isCorrect ? "bg-green-500 hover:bg-green-500" : ""
              }`}
            >
              {option}
            </Button>
          );
        })}
      </div>
      {selectedAnswer !== null && (
        <p className="mt-4 text-center text-gray-600">
          {selectedAnswer === question.correctAnswer 
            ? "Correct! Moving to next question..." 
            : `Incorrect. The correct answer was: ${question.options[question.correctAnswer]}`}
        </p>
      )}
    </Card>
  );
}