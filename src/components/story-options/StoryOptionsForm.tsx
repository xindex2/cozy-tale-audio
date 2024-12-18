import { AgeGroupSelector } from "../story-options/AgeGroupSelector";
import { ThemeSelector } from "../story-options/ThemeSelector";
import { DurationSelector } from "../story-options/DurationSelector";
import { VoiceLanguageSelector } from "../story-options/VoiceLanguageSelector";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import type { StorySettings } from "../StoryOptions";

interface StoryOptionsFormProps {
  settings: StorySettings;
  onSettingsChange: (settings: Partial<StorySettings>) => void;
  onStart: (settings: StorySettings) => void;
}

export function StoryOptionsForm({ settings, onSettingsChange, onStart }: StoryOptionsFormProps) {
  return (
    <div className="space-y-4 sm:space-y-6 pb-8">
      <div className="group transition-transform duration-200 ease-in-out hover:scale-[1.01]">
        <VoiceLanguageSelector
          selectedVoice={settings.voice}
          onVoiceSelect={(voice) => onSettingsChange({ voice })}
          selectedLanguage={settings.language}
          onLanguageSelect={(language) => onSettingsChange({ language })}
        />
      </div>

      <div className="group transition-transform duration-200 ease-in-out hover:scale-[1.01]">
        <AgeGroupSelector
          selectedAge={settings.ageGroup}
          onAgeSelect={(ageGroup) => onSettingsChange({ ageGroup })}
        />
      </div>

      <div className="group transition-transform duration-200 ease-in-out hover:scale-[1.01]">
        <ThemeSelector
          selectedTheme={settings.theme}
          onThemeSelect={(theme) => onSettingsChange({ theme })}
        />
      </div>

      <div className="group transition-transform duration-200 ease-in-out hover:scale-[1.01]">
        <DurationSelector
          selectedDuration={settings.duration}
          onDurationSelect={(duration) => onSettingsChange({ duration })}
        />
      </div>

      <div className="flex justify-center mt-6 sm:mt-8 px-4">
        <Button
          onClick={() => onStart(settings)}
          className="w-full sm:w-[400px] h-12 sm:h-16 text-base sm:text-lg font-medium bg-gradient-to-r from-[#1a237e] via-[#1565c0] to-[#0288d1] hover:from-[#0d47a1] hover:to-[#01579b] text-white rounded-2xl shadow-xl transition-all duration-300 hover:shadow-blue-400/30 hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-4 border-0"
          size="lg"
        >
          Create Your Story
          <Play className="w-5 h-5 sm:w-6 sm:h-6" />
        </Button>
      </div>
    </div>
  );
}