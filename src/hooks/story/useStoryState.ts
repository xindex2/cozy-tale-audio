import { useState } from "react";
import type { Message, QuizQuestion } from "@/types/story";

export function useStoryState() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [musicVolume, setMusicVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  const [isMusicMuted, setIsMusicMuted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentAudioUrl, setCurrentAudioUrl] = useState<string | null>(null);
  const [currentMusicUrl, setCurrentMusicUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [storyTitle, setStoryTitle] = useState("");
  const [storyContent, setStoryContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamedContent, setStreamedContent] = useState("");
  const [quiz, setQuiz] = useState<QuizQuestion[]>([]);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [loadingStage, setLoadingStage] = useState<'text' | 'audio' | 'music'>('text');

  return {
    playback: {
      isPlaying,
      setIsPlaying,
      currentTime,
      setCurrentTime
    },
    audio: {
      volume,
      setVolume,
      musicVolume,
      setMusicVolume,
      isMuted,
      setIsMuted,
      isMusicMuted,
      setIsMusicMuted,
      currentAudioUrl,
      setCurrentAudioUrl,
      currentMusicUrl,
      setCurrentMusicUrl
    },
    story: {
      title: storyTitle,
      setTitle: setStoryTitle,
      content: storyContent,
      setContent: setStoryContent,
      messages,
      setMessages,
      isStreaming,
      setIsStreaming,
      streamedContent,
      setStreamedContent
    },
    loading: {
      isLoading,
      setIsLoading,
      isSending,
      setIsSending,
      isGeneratingQuiz,
      setIsGeneratingQuiz,
      stage: loadingStage,
      setStage: setLoadingStage
    },
    quiz: {
      questions: quiz,
      setQuestions: setQuiz
    }
  };
}