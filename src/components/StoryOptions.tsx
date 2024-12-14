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
    <div className="bg-gradient-to-br from-[#1a237e]/5 via-[#1565c0]/10 to-[#0288d1]/5">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8 animate-fade-in space-y-4 pt-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#1a237e] via-[#1565c0] to-[#0288d1] bg-clip-text text-transparent">
              Bedtime Stories AI
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Create personalized bedtime stories with AI-powered storytelling
            </p>
            <div className="flex gap-2 justify-center">
              <div className="h-2 w-2 rounded-full bg-blue-600 animate-pulse"></div>
              <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse delay-100"></div>
              <div className="h-2 w-2 rounded-full bg-blue-400 animate-pulse delay-200"></div>
            </div>
          </div>

          <div className="space-y-6 pb-8">
            {/* Language, Voice and Age Group Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="w-full transform hover:scale-[1.02] transition-transform duration-300">
                <LanguageSelector
                  selectedLanguage={settings.language}
                  onLanguageSelect={(language) => setSettings({ ...settings, language })}
                />
              </div>
              <div className="w-full transform hover:scale-[1.02] transition-transform duration-300">
                <VoiceSelector
                  selectedVoice={settings.voice}
                  onVoiceSelect={(voice) => setSettings({ ...settings, voice })}
                />
              </div>
              <div className="w-full transform hover:scale-[1.02] transition-transform duration-300">
                <AgeGroupSelector
                  selectedAge={settings.ageGroup}
                  onAgeSelect={(age) => setSettings({ ...settings, ageGroup: age })}
                />
              </div>
            </div>

            {/* Theme Section */}
            <div className="w-full transform hover:scale-[1.02] transition-transform duration-300">
              <ThemeSelector
                selectedTheme={settings.theme}
                onThemeSelect={(theme) => setSettings({ ...settings, theme })}
              />
            </div>

            {/* Music Section */}
            <div className="w-full transform hover:scale-[1.02] transition-transform duration-300">
              <MusicSelector
                selectedMusic={settings.music}
                onMusicSelect={(music) => setSettings({ ...settings, music })}
              />
            </div>

            {/* Start Button */}
            <div className="flex justify-center mt-8">
              <Button
                onClick={() => onStart(settings)}
                className="w-full sm:w-[400px] h-16 text-lg font-medium bg-gradient-to-r from-[#1a237e] via-[#1565c0] to-[#0288d1] hover:from-[#0d47a1] hover:to-[#01579b] text-white rounded-2xl shadow-xl transition-all duration-300 hover:shadow-blue-400/30 hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-4 border-0"
                size="lg"
              >
                Create Your Story
                <Play className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}