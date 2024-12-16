import { Loader } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface LoadingStateProps {
  stage?: 'text' | 'audio' | 'music';
}

export function LoadingState({ stage = 'text' }: LoadingStateProps) {
  const getLoadingProgress = () => {
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
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <Loader className="h-8 w-8 animate-spin text-blue-500" />
      <p className="text-blue-600 font-medium">
        {stage === 'text' && "Creating your story..."}
        {stage === 'audio' && "Generating audio narration..."}
        {stage === 'music' && "Adding background music..."}
      </p>
      <div className="w-full max-w-md">
        <Progress value={getLoadingProgress()} className="h-2" />
      </div>
    </div>
  );
}