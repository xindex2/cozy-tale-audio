import { Card } from "@/components/ui/card";
import { Loader } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface LoadingStateProps {
  stage?: 'text' | 'audio' | 'music';
}

export function LoadingState({ stage = 'text' }: LoadingStateProps) {
  const getStageText = () => {
    switch (stage) {
      case 'text':
        return "Creating your story...";
      case 'audio':
        return "Generating audio narration...";
      case 'music':
        return "Adding background music...";
      default:
        return "Loading...";
    }
  };

  const getProgress = () => {
    switch (stage) {
      case 'text':
        return 33;
      case 'audio':
        return 66;
      case 'music':
        return 100;
      default:
        return 0;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 animate-fade-in">
      <Card className="p-8 flex flex-col items-center justify-center min-h-[400px] bg-gradient-to-r from-blue-50 to-blue-100">
        <Loader className="h-8 w-8 animate-spin text-blue-500 mb-4" />
        <p className="text-blue-600 mb-4">{getStageText()}</p>
        <div className="w-full max-w-md">
          <Progress value={getProgress()} className="h-2" />
        </div>
      </Card>
    </div>
  );
}