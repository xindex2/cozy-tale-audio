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
        return "Creating your bedtime story... This may take a minute";
      case 'audio':
        return "Generating soothing narration...";
      case 'music':
        return "Adding peaceful background music...";
      default:
        return "Loading...";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-blue-600">Bedtimey</h2>
        <p className="text-gray-600">Your bedtime story is on its way</p>
      </div>
      
      <Loader className="h-8 w-8 animate-spin text-blue-500" />
      
      <p className="text-blue-600 font-medium text-lg">
        {getLoadingMessage()}
      </p>
      
      <div className="w-full max-w-md space-y-2">
        <Progress value={getLoadingProgress()} className="h-3" />
        <p className="text-sm text-gray-500 text-center">
          {getLoadingProgress()}% Complete
        </p>
      </div>
    </div>
  );
}