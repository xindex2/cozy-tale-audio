import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AgeGroupSelector } from "./story-options/AgeGroupSelector";
import { ThemeSelector } from "./story-options/ThemeSelector";
import { DurationSelector } from "./story-options/DurationSelector";
import { MusicSelector } from "./story-options/MusicSelector";
import { VoiceSelector } from "./story-options/VoiceSelector";
import { LanguageSelector } from "./story-options/LanguageSelector";
import { Play } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-[1200px] mx-auto px-6">
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-6xl font-bold text-blue-500">
            Bedtime Stories
          </h1>
          <p className="text-xl text-blue-400">
            Customize your perfect bedtime story
          </p>
        </div>

        <div className="space-y-16 max-w-[800px] mx-auto">
          {/* First row: Language and Age Group */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 justify-items-center">
            <div className="w-[300px]">
              <LanguageSelector
                selectedLanguage={settings.language}
                onLanguageSelect={(language) => setSettings({ ...settings, language })}
              />
            </div>
            <div className="w-[300px]">
              <AgeGroupSelector
                selectedAge={settings.ageGroup}
                onAgeSelect={(age) => setSettings({ ...settings, ageGroup: age })}
              />
            </div>
          </div>

          {/* Second row: Theme */}
          <div className="w-full flex justify-center">
            <div className="w-[700px]">
              <ThemeSelector
                selectedTheme={settings.theme}
                onThemeSelect={(theme) => setSettings({ ...settings, theme })}
              />
            </div>
          </div>

          {/* Third row: Music and Voice */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 justify-items-center">
            <div className="w-[300px]">
              <MusicSelector
                selectedMusic={settings.music}
                onMusicSelect={(music) => setSettings({ ...settings, music })}
              />
            </div>
            <div className="w-[300px]">
              <VoiceSelector
                selectedVoice={settings.voice}
                onVoiceSelect={(voice) => setSettings({ ...settings, voice })}
              />
            </div>
          </div>

          {/* Fourth row: Start Button */}
          <div className="flex justify-center pt-8">
            <Button
              onClick={() => onStart(settings)}
              className="w-[300px] h-16 text-xl font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-2xl shadow-lg transition-all duration-200 hover:shadow-xl flex items-center justify-center gap-3"
              size="lg"
            >
              Start Story
              <Play className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}