import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Check, X, RefreshCw } from "lucide-react";

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
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  const handleAnswerClick = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setShowCorrectAnswer(true);
    
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    // Move to next question after showing correct answer
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setShowCorrectAnswer(false);
      } else {
        setShowScore(true);
      }
    }, 2000);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setSelectedAnswer(null);
    setShowCorrectAnswer(false);
  };

  if (!questions.length) {
    return (
      <Card className="p-6 text-center bg-white/90">
        <p className="text-gray-600">No quiz available for this story yet.</p>
        <Button
          onClick={onRegenerateQuiz}
          className="mt-4 bg-gradient-to-r from-blue-500 to-blue-600"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Generate Quiz
        </Button>
      </Card>
    );
  }

  if (showScore) {
    return (
      <Card className="p-6 text-center bg-white/90">
        <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
        <p className="text-xl mb-4">
          Your score: {score} out of {questions.length}
        </p>
        <div className="space-x-4">
          <Button
            onClick={resetQuiz}
            className="bg-gradient-to-r from-blue-500 to-blue-600"
          >
            Try Again
          </Button>
          <Button
            onClick={onRegenerateQuiz}
            variant="outline"
            className="border-blue-500 text-blue-600"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            New Quiz
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white/90">
      <div className="mb-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">
            Question {currentQuestion + 1} of {questions.length}
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={onRegenerateQuiz}
            className="border-blue-500 text-blue-600"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            New Quiz
          </Button>
        </div>
        <p className="text-gray-700">{questions[currentQuestion].question}</p>
      </div>
      <div className="space-y-2">
        {questions[currentQuestion].options.map((option, index) => {
          const isCorrect = index === questions[currentQuestion].correctAnswer;
          const isSelected = selectedAnswer === index;
          
          return (
            <Button
              key={index}
              onClick={() => !showCorrectAnswer && handleAnswerClick(index)}
              disabled={showCorrectAnswer}
              className={`w-full justify-start text-left ${
                showCorrectAnswer
                  ? isCorrect
                    ? "bg-green-500 hover:bg-green-500"
                    : isSelected
                    ? "bg-red-500 hover:bg-red-500"
                    : "bg-gray-200 hover:bg-gray-200"
                  : "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              }`}
            >
              {showCorrectAnswer && isCorrect && (
                <Check className="w-4 h-4 mr-2" />
              )}
              {showCorrectAnswer && isSelected && !isCorrect && (
                <X className="w-4 h-4 mr-2" />
              )}
              {option}
            </Button>
          );
        })}
      </div>
      {showCorrectAnswer && (
        <p className="mt-4 text-center text-gray-600">
          Moving to next question...
        </p>
      )}
    </Card>
  );
}