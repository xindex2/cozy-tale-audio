import { useState } from "react";
import { StoryOptions, type StorySettings } from "@/components/StoryOptions";
import { StoryPlayer } from "@/components/StoryPlayer";
import { Header } from "@/components/layout/Header";

const Index = () => {
  const [storySettings, setStorySettings] = useState<StorySettings | null>(null);

  const handleStart = (settings: StorySettings) => {
    setStorySettings(settings);
  };

  const handleBack = () => {
    setStorySettings(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-blue-50 to-white">
      <Header />
      <main className="flex-1 container py-8">
        {storySettings ? (
          <StoryPlayer settings={storySettings} onBack={handleBack} />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <StoryOptions onStart={handleStart} />
          </div>
        )}
      </main>
    </div>
  );
}

export default Index;