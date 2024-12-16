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

  const getLoadingMessage = () => {
    switch (stage) {
      case 'text':
        return "Creating your story... This may take a minute";
      case 'audio':
        return "Generating audio narration...";
      case 'music':
        return "Adding background music...";
      default:
        return "Loading...";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <Loader className="h-8 w-8 animate-spin text-blue-500" />
      <p className="text-blue-600 font-medium">
        {getLoadingMessage()}
      </p>
      <div className="w-full max-w-md">
        <Progress value={getLoadingProgress()} className="h-2" />
      </div>
    </div>
  );
}