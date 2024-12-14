import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AgeGroupSelector } from "./story-options/AgeGroupSelector";
import { ThemeSelector } from "./story-options/ThemeSelector";
import { DurationSelector } from "./story-options/DurationSelector";
import { MusicSelector } from "./story-options/MusicSelector";
import { VoiceSelector } from "./story-options/VoiceSelector";
import { LanguageSelector } from "./story-options/LanguageSelector";

interface StoryOptionsProps {
  onStart: (options: StorySettings) => void;
}

export interface StorySettings {
  ageGroup: string;
  duration: number;
  music: string;
  voice: string;
  theme: string;
  language: string;
}

export function StoryOptions({ onStart }: StoryOptionsProps) {
  const [settings, setSettings] = useState<StorySettings>({
    ageGroup: "6-8",
    duration: 5,
    music: "gentle-lullaby",
    voice: "EXAVITQu4vr4xnSDxMaL",
    theme: "fantasy",
    language: "en"
  });

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-8 animate-fade-in">
      <div className="text-center space-y-3">
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
          Bedtime Stories
        </h1>
        <p className="text-lg text-blue-600/90">Customize your perfect bedtime story</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="space-y-6">
          <LanguageSelector
            selectedLanguage={settings.language}
            onLanguageSelect={(language) => setSettings({ ...settings, language })}
          />
          <AgeGroupSelector
            selectedAge={settings.ageGroup}
            onAgeSelect={(age) => setSettings({ ...settings, ageGroup: age })}
          />
        </div>
        
        <div className="space-y-6">
          <ThemeSelector
            selectedTheme={settings.theme}
            onThemeSelect={(theme) => setSettings({ ...settings, theme })}
          />
          <DurationSelector
            selectedDuration={settings.duration}
            onDurationSelect={(duration) => setSettings({ ...settings, duration })}
          />
        </div>
        
        <div className="space-y-6">
          <MusicSelector
            selectedMusic={settings.music}
            onMusicSelect={(music) => setSettings({ ...settings, music })}
          />
          <VoiceSelector
            selectedVoice={settings.voice}
            onVoiceSelect={(voice) => setSettings({ ...settings, voice })}
          />
        </div>
      </div>

      <Button
        onClick={() => onStart(settings)}
        className="w-full max-w-md mx-auto block mt-12 h-14 text-lg font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
        size="lg"
      >
        Start Story
      </Button>
    </div>
  );
}