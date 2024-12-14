import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trophy, Check, X } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizProps {
  questions: Question[];
}

export function Quiz({ questions }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  const handleAnswerClick = (answerIndex: number) => {
    if (selectedAnswer !== null) return; // Prevent multiple selections
    
    setSelectedAnswer(answerIndex);
    setShowCorrectAnswer(true);
    
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    // Move to next question after 2 seconds
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
      </Card>
    );
  }

  if (showScore) {
    return (
      <Card className="p-6 text-center bg-white/90">
        <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold mb-4">Quiz Complete!</h2>
        <p className="text-xl">
          Your score: {score} out of {questions.length}
        </p>
        <Button
          onClick={resetQuiz}
          className="mt-4 bg-gradient-to-r from-blue-500 to-blue-600"
        >
          Try Again
        </Button>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-white/90">
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">
          Question {currentQuestion + 1} of {questions.length}
        </h3>
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