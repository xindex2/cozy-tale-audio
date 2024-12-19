import { VoiceLanguageSelector } from "../VoiceLanguageSelector";
import { Globe } from "lucide-react";
import type { StorySettings } from "../../StoryOptions";

interface LanguageSectionProps {
  settings: StorySettings;
  onSettingsChange: (settings: Partial<StorySettings>) => void;
}

export function LanguageSection({ settings, onSettingsChange }: LanguageSectionProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Globe className="h-6 w-6 text-primary" />
        <h3 className="text-lg font-semibold text-gray-900">Language & Voice</h3>
      </div>
      <VoiceLanguageSelector 
        selectedVoice={settings.voice}
        selectedLanguage={settings.language}
        onVoiceSelect={(value) => onSettingsChange({ voice: value })}
        onLanguageSelect={(value) => onSettingsChange({ language: value })} 
      />
    </div>
  );
}