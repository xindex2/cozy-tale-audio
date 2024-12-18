import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import debounce from 'lodash/debounce';

export function useStorySave(onSave?: (title: string, content: string, audioUrl: string, backgroundMusicUrl: string) => void) {
  const [isSaving, setIsSaving] = useState(false);
  const [savedAudioUrl, setSavedAudioUrl] = useState<string | null>(null);
  const { toast } = useToast();

  // Debounced save function to prevent multiple rapid saves
  const debouncedSave = debounce((title: string, content: string, audioUrl: string, backgroundMusicUrl: string) => {
    if (!onSave || isSaving || audioUrl === savedAudioUrl) return;

    setIsSaving(true);
    try {
      onSave(title, content, audioUrl, backgroundMusicUrl);
      setSavedAudioUrl(audioUrl);
      toast({
        title: "Success",
        description: "Story saved successfully",
        duration: 3000,
      });
    } catch (error) {
      console.error('Error saving story:', error);
      toast({
        title: "Error",
        description: "Failed to save story",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSaving(false);
    }
  }, 1000);

  return {
    saveStory: debouncedSave,
    isSaving,
    savedAudioUrl
  };
}