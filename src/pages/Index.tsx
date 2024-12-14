import { useState } from "react";
import { StoryOptions, type StorySettings } from "@/components/StoryOptions";
import { StoryPlayer } from "@/components/StoryPlayer";

const Index = () => {
  const [storySettings, setStorySettings] = useState<StorySettings | null>(null);

  const handleStart = (settings: StorySettings) => {
    setStorySettings(settings);
  };

  const handleBack = () => {
    setStorySettings(null);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {storySettings ? (
        <StoryPlayer settings={storySettings} onBack={handleBack} />
      ) : (
        <StoryOptions onStart={handleStart} />
      )}
    </div>
  );
};

export default Index;