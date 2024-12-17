import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

interface QuizQuestionProps {
  question: string;
  options: string[];
  currentQuestion: number;
  totalQuestions: number;
  selectedAnswer: number | null;
  isAnswered: boolean;
  correctAnswer: number;
  onAnswerClick: (index: number) => void;
  language: string;
}

export function QuizQuestion({
  question,
  options,
  currentQuestion,
  totalQuestions,
  selectedAnswer,
  isAnswered,
  correctAnswer,
  onAnswerClick,
  language,
}: QuizQuestionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentQuestion}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}
      >
        <Card className="p-3 sm:p-6">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base sm:text-lg font-semibold">
                {language === 'ar' 
                  ? `السؤال ${currentQuestion + 1} من ${totalQuestions}`
                  : language === 'es'
                    ? `Pregunta ${currentQuestion + 1} de ${totalQuestions}`
                    : `Question ${currentQuestion + 1} of ${totalQuestions}`}
              </h3>
            </div>
            <p className="text-gray-700 mb-4 text-sm sm:text-base">{question}</p>
          </div>
          <div className="space-y-2">
            {options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === correctAnswer;
              const showResult = isAnswered;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    onClick={() => onAnswerClick(index)}
                    disabled={isAnswered}
                    variant={showResult 
                      ? isCorrect 
                        ? "default"
                        : isSelected 
                          ? "destructive"
                          : "outline"
                      : "outline"
                    }
                    className={`w-full justify-start text-left text-sm sm:text-base p-3 sm:p-4 transition-colors ${
                      showResult && isCorrect ? "bg-green-500 hover:bg-green-500" : ""
                    }`}
                  >
                    {option}
                  </Button>
                </motion.div>
              );
            })}
          </div>
          {isAnswered && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-center text-sm sm:text-base text-gray-600"
            >
              {selectedAnswer === correctAnswer 
                ? language === 'ar'
                  ? "صحيح! الانتقال إلى السؤال التالي..."
                  : language === 'es'
                    ? "¡Correcto! Pasando a la siguiente pregunta..."
                    : "Correct! Moving to next question..."
                : language === 'ar'
                  ? `غير صحيح. الإجابة الصحيحة هي: ${options[correctAnswer]}`
                  : language === 'es'
                    ? `Incorrecto. La respuesta correcta era: ${options[correctAnswer]}`
                    : `Incorrect. The correct answer was: ${options[correctAnswer]}`}
            </motion.p>
          )}
        </Card>
      </motion.div>
    </AnimatePresence>
  );
}