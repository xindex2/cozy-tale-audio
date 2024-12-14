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
    <div className="w-full max-w-7xl mx-auto px-4 py-8 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-6xl font-bold text-blue-500">
          Bedtime Stories
        </h1>
        <p className="text-xl text-blue-400">
          Customize your perfect bedtime story
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="space-y-8">
          <LanguageSelector
            selectedLanguage={settings.language}
            onLanguageSelect={(language) => setSettings({ ...settings, language })}
          />
          <AgeGroupSelector
            selectedAge={settings.ageGroup}
            onAgeSelect={(age) => setSettings({ ...settings, ageGroup: age })}
          />
        </div>
        
        <div className="space-y-8">
          <ThemeSelector
            selectedTheme={settings.theme}
            onThemeSelect={(theme) => setSettings({ ...settings, theme })}
          />
          <DurationSelector
            selectedDuration={settings.duration}
            onDurationSelect={(duration) => setSettings({ ...settings, duration })}
          />
        </div>
        
        <div className="space-y-8">
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
        className="w-full max-w-md mx-auto block mt-16 h-16 text-xl font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-2xl shadow-lg transition-all duration-200 hover:shadow-xl"
        size="lg"
      >
        Start Story
      </Button>
    </div>
  );
}