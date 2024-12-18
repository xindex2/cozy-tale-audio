import { useState, useEffect } from "react";
import type { StorySettings } from "@/components/StoryOptions";

const STORAGE_KEY = "story_settings";

export function useStorySettings(initialSettings?: StorySettings) {
  const [settings, setSettings] = useState<StorySettings>(() => {
    if (initialSettings) return initialSettings;
    
    const saved = sessionStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved settings:", e);
      }
    }
    
    return {
      ageGroup: "6-8",
      duration: 5,
      music: "no-music",
      voice: "alloy",
      theme: "fantasy",
      language: "en"
    };
  });

  useEffect(() => {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  return {
    settings,
    updateSettings: (newSettings: Partial<StorySettings>) => {
      setSettings(prev => ({ ...prev, ...newSettings }));
    }
  };
}