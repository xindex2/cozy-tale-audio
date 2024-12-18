import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { AgeGroupSelector } from "./AgeGroupSelector";
import { DurationSelector } from "./DurationSelector";
import { MusicSelector } from "./MusicSelector";
import { ThemeSelector } from "./ThemeSelector";
import { VoiceLanguageSelector } from "./VoiceLanguageSelector";
import type { StorySettings } from "../StoryOptions";

interface StoryOptionsFormProps {
  settings: StorySettings;
  onSettingsChange: (settings: Partial<StorySettings>) => void;
  onStart: (settings: StorySettings) => void;
}

export function StoryOptionsForm({ settings, onSettingsChange, onStart }: StoryOptionsFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart(settings);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 mb-8">
      <Card className="p-6">
        <div className="space-y-6">
          <AgeGroupSelector 
            selectedAge={settings.ageGroup} 
            onAgeSelect={(value) => onSettingsChange({ ageGroup: value })} 
          />
          
          <DurationSelector 
            selectedDuration={settings.duration} 
            onDurationSelect={(value) => onSettingsChange({ duration: value })} 
          />
          
          <MusicSelector 
            selectedMusic={settings.music} 
            onMusicSelect={(value) => onSettingsChange({ music: value })} 
          />
          
          <ThemeSelector 
            selectedTheme={settings.theme} 
            onThemeSelect={(value) => onSettingsChange({ theme: value })} 
          />
          
          <VoiceLanguageSelector 
            selectedVoice={settings.voice}
            selectedLanguage={settings.language}
            onVoiceSelect={(value) => onSettingsChange({ voice: value })}
            onLanguageSelect={(value) => onSettingsChange({ language: value })}
          />
        </div>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg">
          Start Story
        </Button>
      </div>
    </form>
  );
}