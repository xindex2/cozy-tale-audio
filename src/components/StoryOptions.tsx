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
    <div className="min-h-screen bg-gradient-to-br from-blue-500/5 via-blue-500/10 to-blue-600/5">
      <div className="w-full px-4 py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-4">
              Bedtime Stories
            </h1>
            <p className="text-lg sm:text-xl text-blue-600/80">
              Craft Your Perfect Bedtime Story Experience
            </p>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {/* Language and Age Group Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="w-full">
                <LanguageSelector
                  selectedLanguage={settings.language}
                  onLanguageSelect={(language) => setSettings({ ...settings, language })}
                />
              </div>
              <div className="w-full">
                <AgeGroupSelector
                  selectedAge={settings.ageGroup}
                  onAgeSelect={(age) => setSettings({ ...settings, ageGroup: age })}
                />
              </div>
            </div>

            {/* Theme Section */}
            <div className="w-full">
              <ThemeSelector
                selectedTheme={settings.theme}
                onThemeSelect={(theme) => setSettings({ ...settings, theme })}
              />
            </div>

            {/* Music and Voice Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="w-full">
                <MusicSelector
                  selectedMusic={settings.music}
                  onMusicSelect={(music) => setSettings({ ...settings, music })}
                />
              </div>
              <div className="w-full">
                <VoiceSelector
                  selectedVoice={settings.voice}
                  onVoiceSelect={(voice) => setSettings({ ...settings, voice })}
                />
              </div>
            </div>

            {/* Start Button */}
            <div className="flex justify-center mt-8">
              <Button
                onClick={() => onStart(settings)}
                className="w-full sm:w-[280px] h-14 text-lg font-medium bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white rounded-xl shadow-lg transition-all duration-300 hover:shadow-blue-400/20 hover:shadow-xl flex items-center justify-center gap-3 border-0"
                size="lg"
              >
                Create Your Story
                <Play className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}