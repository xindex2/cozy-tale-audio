import { useState } from "react";
import { StoryOptions, type StorySettings } from "@/components/StoryOptions";
import { StoryPlayer } from "@/components/StoryPlayer";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function Index() {
  const [storySettings, setStorySettings] = useState<StorySettings | null>(null);

  const handleStart = (settings: StorySettings) => {
    setStorySettings(settings);
  };

  const handleBack = () => {
    setStorySettings(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-500">
      <Header />
      <main className="flex-1 w-full px-0 sm:container sm:px-8 py-8">
        {storySettings ? (
          <StoryPlayer settings={storySettings} onBack={handleBack} />
        ) : (
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <StoryOptions onStart={handleStart} />
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}