import { useState, useCallback } from "react";
import { StoryOptions, type StorySettings } from "@/components/StoryOptions";
import { StoryPlayer } from "@/components/StoryPlayer";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useStoryPersistence } from "@/hooks/story/useStoryPersistence";
import { Button } from "@/components/ui/button";
import { Moon, Stars, BookOpen, Sparkles } from "lucide-react";

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
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-indigo-50 via-purple-50 to-blue-50">
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
          <>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
              <div className="text-center">
                <h1 className="text-4xl sm:text-5xl font-bold text-indigo-900 mb-6">
                  Create Magical Bedtime Stories
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-12">
                  Generate personalized bedtime stories with soothing narration and peaceful background music
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                  <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Moon className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Peaceful Stories</h3>
                    <p className="text-gray-600">Calming tales perfect for bedtime</p>
                  </div>
                  <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Stars className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Soothing Voices</h3>
                    <p className="text-gray-600">Natural narration in multiple languages</p>
                  </div>
                  <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Custom Themes</h3>
                    <p className="text-gray-600">Stories tailored to your preferences</p>
                  </div>
                  <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow">
                    <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-6 h-6 text-pink-600" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">AI-Powered</h3>
                    <p className="text-gray-600">Unique stories every time</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <StoryOptions onStart={handleStart} />
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}