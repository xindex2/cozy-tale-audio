import type { StorySettings } from "@/components/StoryOptions";
import { useStoryGeneration } from "./useStoryGeneration";
import { useQuizGeneration } from "./useQuizGeneration";
import { useChatMessages } from "./useChatMessages";

export function useStoryActions(
  state: ReturnType<typeof import("./useStoryState").useStoryState>,
  onSave?: (title: string, content: string, audioUrl: string, backgroundMusicUrl: string) => void
) {
  const { generateStory } = useStoryGeneration();
  const { generateQuiz } = useQuizGeneration(state);
  const { handleSendMessage } = useChatMessages(state);

  const startStory = async (settings: StorySettings) => {
    const result = await generateStory(settings);
    if (result) {
      state.story.setTitle(result.title);
      state.story.setContent(result.content);
      if (onSave) {
        onSave(
          result.title,
          result.content,
          state.audio.currentAudioUrl || "",
          state.audio.currentMusicUrl || ""
        );
      }
    }
  };

  return {
    startStory,
    generateQuiz,
    handleSendMessage
  };
}