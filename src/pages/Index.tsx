import { useState, useCallback } from "react";
import { StoryOptions, type StorySettings } from "@/components/StoryOptions";
import { StoryPlayer } from "@/components/StoryPlayer";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useStoryPersistence } from "@/hooks/story/useStoryPersistence";

export default function Index() {
  const [storySettings, setStorySettings] = useState<StorySettings | null>(() => {
    const saved = sessionStorage.getItem('story_settings');
    return saved ? JSON.parse(saved) : null;
  });
  
  const { persistedState, clearPersistedState } = useStoryPersistence();

  const handleStart = useCallback((settings: StorySettings) => {
    setStorySettings(settings);
    sessionStorage.setItem('story_settings', JSON.stringify(settings));
  }, []);

  const handleBack = useCallback(() => {
    if (persistedState) {
      const shouldGoBack = window.confirm(
        "Are you sure you want to go back? Your story progress will be lost."
      );
      if (shouldGoBack) {
        setStorySettings(null);
        clearPersistedState();
        sessionStorage.removeItem('story_settings');
      }
    } else {
      setStorySettings(null);
      sessionStorage.removeItem('story_settings');
    }
  }, [persistedState, clearPersistedState]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-500">
      <Header />
      <main className="flex-1 w-full px-0 sm:container sm:px-8 py-8">
        {storySettings ? (
          <StoryPlayer 
            settings={storySettings} 
            onBack={handleBack}
            initialStoryData={persistedState ? {
              title: persistedState.title,
              content: persistedState.content,
              audioUrl: persistedState.audioUrl || undefined,
              backgroundMusicUrl: persistedState.musicUrl || undefined,
            } : undefined}
          />
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