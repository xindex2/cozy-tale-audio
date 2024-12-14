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
      <div className="container mx-auto px-4 py-12 sm:py-16 md:py-20">
        <div className="max-w-4xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mb-4">
              Bedtime Stories
            </h1>
            <p className="text-lg sm:text-xl text-blue-600/80">
              Craft Your Perfect Bedtime Story Experience
            </p>
          </div>

          <div className="grid gap-8 sm:gap-10">
            {/* Language and Age Group Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <div className="w-full sm:max-w-[280px] mx-auto">
                <LanguageSelector
                  selectedLanguage={settings.language}
                  onLanguageSelect={(language) => setSettings({ ...settings, language })}
                />
              </div>
              <div className="w-full sm:max-w-[280px] mx-auto">
                <AgeGroupSelector
                  selectedAge={settings.ageGroup}
                  onAgeSelect={(age) => setSettings({ ...settings, ageGroup: age })}
                />
              </div>
            </div>

            {/* Theme Section */}
            <div className="w-full max-w-[600px] mx-auto">
              <ThemeSelector
                selectedTheme={settings.theme}
                onThemeSelect={(theme) => setSettings({ ...settings, theme })}
              />
            </div>

            {/* Music and Voice Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
              <div className="w-full sm:max-w-[280px] mx-auto">
                <MusicSelector
                  selectedMusic={settings.music}
                  onMusicSelect={(music) => setSettings({ ...settings, music })}
                />
              </div>
              <div className="w-full sm:max-w-[280px] mx-auto">
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