import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader } from "lucide-react";

interface EmptyQuizStateProps {
  onGenerate: () => void;
  isGenerating: boolean;
  language: string;
}

export function EmptyQuizState({ onGenerate, isGenerating, language }: EmptyQuizStateProps) {
  const getNoQuizText = (language: string) => ({
    en: "No quiz available for this story yet.",
    es: "Aún no hay cuestionario disponible para esta historia.",
    ar: "لا يوجد اختبار متاح لهذه القصة بعد."
  }[language] || "No quiz available for this story yet.");

  return (
    <Card className="p-4 sm:p-6 text-center">
      <p className="text-gray-600 mb-4 text-sm sm:text-base" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
        {getNoQuizText(language)}
      </p>
      <Button 
        onClick={onGenerate} 
        disabled={isGenerating}
        className="relative"
      >
        {isGenerating ? (
          <>
            <Loader className="w-4 h-4 mr-2 animate-spin" />
            {language === 'ar' ? 'جاري إنشاء الاختبار...' : 
             language === 'es' ? 'Generando cuestionario...' : 
             'Generating quiz...'}
          </>
        ) : (
          <>
            <RefreshCw className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'إنشاء اختبار' : 
             language === 'es' ? 'Generar cuestionario' : 
             'Generate Quiz'}
          </>
        )}
      </Button>
    </Card>
  );
}