import { AgeGroupSelector } from "../AgeGroupSelector";
import { ThemeSelector } from "../ThemeSelector";
import { Sparkles } from "lucide-react";
import type { StorySettings } from "../../StoryOptions";

interface ThemeSectionProps {
  settings: StorySettings;
  onSettingsChange: (settings: Partial<StorySettings>) => void;
}

export function ThemeSection({ settings, onSettingsChange }: ThemeSectionProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Sparkles className="h-6 w-6 text-primary" />
        <h3 className="text-lg font-semibold text-gray-900">Theme & Age Group</h3>
      </div>
      <div className="grid grid-cols-1 gap-8">
        <AgeGroupSelector 
          selectedAge={settings.ageGroup} 
          onAgeSelect={(value) => onSettingsChange({ ageGroup: value })} 
        />
        <ThemeSelector 
          selectedTheme={settings.theme} 
          onThemeSelect={(value) => onSettingsChange({ theme: value })} 
        />
      </div>
    </div>
  );
}