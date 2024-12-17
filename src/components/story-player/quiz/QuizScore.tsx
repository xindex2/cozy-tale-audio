import { Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";

interface QuizScoreProps {
  score: number;
  totalQuestions: number;
  onReset: () => void;
  onRegenerate: () => void;
  language: string;
}

export function QuizScore({ score, totalQuestions, onReset, onRegenerate, language }: QuizScoreProps) {
  const getScoreText = (language: string, score: number, total: number) => ({
    en: `Your score: ${score} out of ${total}`,
    es: `Tu puntuación: ${score} de ${total}`,
    ar: `نتيجتك: ${score} من ${total}`
  }[language] || `Your score: ${score} out of ${total}`);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}
    >
      <Card className="p-4 sm:p-6 text-center">
        <Trophy className="w-12 h-12 sm:w-16 sm:h-16 mx-auto text-yellow-500 mb-4" />
        <h2 className="text-xl sm:text-2xl font-bold mb-4">
          {language === 'ar' ? 'اكتمل الاختبار!' : 
           language === 'es' ? '¡Cuestionario completado!' : 
           'Quiz Complete!'}
        </h2>
        <p className="text-lg sm:text-xl mb-4">
          {getScoreText(language, score, totalQuestions)}
        </p>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
          <Button onClick={onReset} className="w-full sm:w-auto">
            {language === 'ar' ? 'حاول مرة أخرى' : 
             language === 'es' ? 'Intentar de nuevo' : 
             'Try Again'}
          </Button>
          <Button onClick={onRegenerate} variant="outline" className="w-full sm:w-auto">
            {language === 'ar' ? 'إنشاء اختبار جديد' : 
             language === 'es' ? 'Generar nuevo cuestionario' : 
             'Generate New Quiz'}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}