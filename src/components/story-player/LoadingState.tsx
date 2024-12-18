import { Loader } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useEffect, useState } from "react";

interface LoadingStateProps {
  stage?: 'text' | 'audio' | 'music';
}

export function LoadingState({ stage = 'text' }: LoadingStateProps) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    return () => clearInterval(interval);
  }, []);

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
    <div className="flex flex-col items-center justify-center py-12 space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold text-blue-600">Bedtimey</h2>
        <p className="text-gray-600">Your bedtime story is on its way</p>
      </div>
      
      <Loader className="h-8 w-8 animate-spin text-blue-500" />
      
      <div className="text-center space-y-2">
        <p className="text-blue-600 font-medium text-lg">
          {getLoadingMessage()}
        </p>
        <p className="text-sm text-gray-500">
          {getDetailedMessage()}
        </p>
      </div>
      
      <div className="w-full max-w-md space-y-2">
        <Progress value={getLoadingProgress()} className="h-3" />
        <p className="text-sm text-gray-500 text-center">
          {getLoadingProgress()}% Complete
        </p>
      </div>
    </div>
  );
}