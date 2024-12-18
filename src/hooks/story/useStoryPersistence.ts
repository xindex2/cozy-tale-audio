import { useState, useEffect } from "react";
import type { Message, QuizQuestion } from "@/types/story";

const STORAGE_KEY_PREFIX = "story_state_";

interface StoredStoryState {
  title: string;
  content: string;
  audioUrl: string | null;
  musicUrl: string | null;
  messages: Message[];
  quiz: QuizQuestion[];
  currentTime: number;
}

export function useStoryPersistence(storyId?: string) {
  const storageKey = `${STORAGE_KEY_PREFIX}${storyId || 'current'}`;
  
  const [persistedState, setPersistedState] = useState<StoredStoryState | null>(() => {
    const saved = sessionStorage.getItem(storageKey);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Error parsing saved story state:", e);
        return null;
      }
    }
    return null;
  });

  const persistState = (state: StoredStoryState) => {
    sessionStorage.setItem(storageKey, JSON.stringify(state));
    setPersistedState(state);
  };

  const clearPersistedState = () => {
    sessionStorage.removeItem(storageKey);
    setPersistedState(null);
  };

  useEffect(() => {
    return () => {
      // Clear persisted state when component unmounts and user confirms
      if (persistedState && !storyId) {
        const shouldClear = window.confirm(
          "Are you sure you want to leave? Your story progress will be lost."
        );
        if (shouldClear) {
          clearPersistedState();
        }
      }
    };
  }, [storyId, persistedState]);

  return {
    persistedState,
    persistState,
    clearPersistedState
  };
}