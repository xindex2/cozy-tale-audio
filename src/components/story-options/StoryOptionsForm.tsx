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
            value={settings.ageGroup} 
            onChange={(value) => onSettingsChange({ ageGroup: value })} 
          />
          
          <DurationSelector 
            value={settings.duration} 
            onChange={(value) => onSettingsChange({ duration: value })} 
          />
          
          <MusicSelector 
            value={settings.music} 
            onChange={(value) => onSettingsChange({ music: value })} 
          />
          
          <ThemeSelector 
            value={settings.theme} 
            onChange={(value) => onSettingsChange({ theme: value })} 
          />
          
          <VoiceLanguageSelector 
            voice={settings.voice}
            language={settings.language}
            onVoiceChange={(value) => onSettingsChange({ voice: value })}
            onLanguageChange={(value) => onSettingsChange({ language: value })}
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