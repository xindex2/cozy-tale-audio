import { useState } from "react";
import { QuizScore } from "./quiz/QuizScore";
import { QuizQuestion } from "./quiz/QuizQuestion";
import { EmptyQuizState } from "./quiz/EmptyQuizState";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizProps {
  questions: Question[];
  onRegenerateQuiz: () => void;
  language: string;
  isGenerating: boolean;
}

export function Quiz({ questions, onRegenerateQuiz, language, isGenerating }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const handleAnswerClick = (answerIndex: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);
    
    if (answerIndex === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsAnswered(false);
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
    setIsAnswered(false);
  };

  if (!questions.length) {
    return (
      <EmptyQuizState
        onGenerate={onRegenerateQuiz}
        isGenerating={isGenerating}
        language={language}
      />
    );
  }

  if (showScore) {
    return (
      <QuizScore
        score={score}
        totalQuestions={questions.length}
        onReset={resetQuiz}
        onRegenerate={onRegenerateQuiz}
        language={language}
      />
    );
  }

  return (
    <QuizQuestion
      question={questions[currentQuestion].question}
      options={questions[currentQuestion].options}
      currentQuestion={currentQuestion}
      totalQuestions={questions.length}
      selectedAnswer={selectedAnswer}
      isAnswered={isAnswered}
      correctAnswer={questions[currentQuestion].correctAnswer}
      onAnswerClick={handleAnswerClick}
      language={language}
    />
  );
}