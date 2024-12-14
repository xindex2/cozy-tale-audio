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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4 py-8 sm:py-12 md:py-16">
      <div className="w-full max-w-[1000px] mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-blue-500 mb-4">
            Bedtime Stories
          </h1>
          <p className="text-lg sm:text-xl text-blue-400">
            Customize your perfect bedtime story
          </p>
        </div>

        <div className="space-y-8 sm:space-y-12">
          {/* First row: Language and Age Group */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 justify-items-center">
            <div className="w-full max-w-[200px]">
              <LanguageSelector
                selectedLanguage={settings.language}
                onLanguageSelect={(language) => setSettings({ ...settings, language })}
              />
            </div>
            <div className="w-full max-w-[200px]">
              <AgeGroupSelector
                selectedAge={settings.ageGroup}
                onAgeSelect={(age) => setSettings({ ...settings, ageGroup: age })}
              />
            </div>
          </div>

          {/* Second row: Theme */}
          <div className="flex justify-center">
            <div className="w-full max-w-[500px]">
              <ThemeSelector
                selectedTheme={settings.theme}
                onThemeSelect={(theme) => setSettings({ ...settings, theme })}
              />
            </div>
          </div>

          {/* Third row: Music and Voice */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 justify-items-center">
            <div className="w-full max-w-[200px]">
              <MusicSelector
                selectedMusic={settings.music}
                onMusicSelect={(music) => setSettings({ ...settings, music })}
              />
            </div>
            <div className="w-full max-w-[200px]">
              <VoiceSelector
                selectedVoice={settings.voice}
                onVoiceSelect={(voice) => setSettings({ ...settings, voice })}
              />
            </div>
          </div>

          {/* Fourth row: Start Button */}
          <div className="flex justify-center pt-4 sm:pt-6">
            <Button
              onClick={() => onStart(settings)}
              className="w-full max-w-[200px] h-14 text-lg font-medium bg-blue-500 hover:bg-blue-600 text-white rounded-2xl shadow-lg transition-all duration-200 hover:shadow-xl flex items-center justify-center gap-3"
              size="lg"
            >
              Start Story
              <Play className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}