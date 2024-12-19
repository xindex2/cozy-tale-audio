import { Loader } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

interface LoadingStateProps {
  stage?: 'text' | 'audio' | 'music';
}

export function LoadingState({ stage = 'text' }: LoadingStateProps) {
  const [dots, setDots] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    // Simulate progress based on stage
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const max = getLoadingProgress();
        return prev < max ? prev + 1 : prev;
      });
    }, 100);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, [stage]);

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
    const baseMsgs = {
      text: "Creating your bedtime story",
      audio: "Generating soothing narration",
      music: "Adding peaceful background music"
    };
    
    return `${baseMsgs[stage]}${dots}`;
  };

  const getDetailedMessage = () => {
    switch (stage) {
      case 'text':
        return "Our AI is crafting a unique story just for you. This usually takes about a minute...";
      case 'audio':
        return "Converting the story into spoken words with natural voice...";
      case 'music':
        return "Adding background music to enhance the experience...";
      default:
        return "Processing...";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-8 sm:py-12 px-4">
      <div className="text-center space-y-2 mb-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-blue-600">Creating Your Story</h2>
        <p className="text-gray-600">Please wait while we prepare your personalized story</p>
      </div>
      
      <div className="w-full max-w-md space-y-8">
        <div className="flex items-center justify-center">
          <Loader className="h-12 w-12 animate-spin text-blue-500" />
        </div>
        
        <div className="text-center space-y-2">
          <p className="text-blue-600 font-medium text-lg sm:text-xl">
            {getLoadingMessage()}
          </p>
          <p className="text-sm text-gray-500">
            {getDetailedMessage()}
          </p>
        </div>
        
        <div className="space-y-2">
          <Progress value={progress} className="h-3" />
          <p className="text-sm text-gray-500 text-center">
            {progress}% Complete
          </p>
        </div>
      </div>
    </div>
  );
}