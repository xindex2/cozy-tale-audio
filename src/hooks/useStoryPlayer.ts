import { useEffect } from "react";
import type { StorySettings } from "@/components/StoryOptions";
import { useStoryState } from "./story/useStoryState";
import { useStoryActions } from "./story/useStoryActions";

export function useStoryPlayer(
  settings: StorySettings,
  onSave?: (title: string, content: string, audioUrl: string, backgroundMusicUrl: string) => void,
  initialStoryData?: {
    title: string;
    content: string;
    audioUrl?: string;
    backgroundMusicUrl?: string;
  }
) {
  const state = useStoryState();
  const actions = useStoryActions(state, onSave);

  useEffect(() => {
    if (initialStoryData) {
      state.story.setTitle(initialStoryData.title);
      state.story.setContent(initialStoryData.content);
      if (initialStoryData.audioUrl) {
        state.audio.setCurrentAudioUrl(initialStoryData.audioUrl);
      }
      if (initialStoryData.backgroundMusicUrl) {
        state.audio.setCurrentMusicUrl(initialStoryData.backgroundMusicUrl);
      }
    } else if (!state.loading.isLoading && settings && !state.story.content) {
      // Only start story generation if:
      // 1. We're not already loading
      // 2. We have settings
      // 3. We don't already have content
      actions.startStory(settings);
    }
  }, [initialStoryData, settings]);

  return {
    // Playback controls
    isPlaying: state.playback.isPlaying,
    setIsPlaying: state.playback.setIsPlaying,
    currentTime: state.playback.currentTime,
    setCurrentTime: state.playback.setCurrentTime,

    // Audio controls
    volume: state.audio.volume,
    setVolume: state.audio.setVolume,
    musicVolume: state.audio.musicVolume,
    setMusicVolume: state.audio.setMusicVolume,
    isMuted: state.audio.isMuted,
    setIsMuted: state.audio.setIsMuted,
    isMusicMuted: state.audio.isMusicMuted,
    setIsMusicMuted: state.audio.setIsMusicMuted,
    currentAudioUrl: state.audio.currentAudioUrl,
    currentMusicUrl: state.audio.currentMusicUrl,

    // Story content
    messages: state.story.messages,
    storyTitle: state.story.title,
    storyContent: state.story.content,
    isStreaming: state.story.isStreaming,
    streamedContent: state.story.streamedContent,

    // Loading states
    isLoading: state.loading.isLoading,
    isSending: state.loading.isSending,
    isGeneratingQuiz: state.loading.isGeneratingQuiz,
    loadingStage: state.loading.stage,

    // Quiz
    quiz: state.quiz.questions,

    // Actions
    startStory: actions.startStory,
    generateQuiz: actions.generateQuiz,
    handleSendMessage: actions.handleSendMessage,
  };
}