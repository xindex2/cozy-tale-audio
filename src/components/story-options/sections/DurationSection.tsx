import { DurationSelector } from "../DurationSelector";
import { MusicSelector } from "../MusicSelector";
import { Timer } from "lucide-react";
import type { StorySettings } from "../../StoryOptions";

interface DurationSectionProps {
  settings: StorySettings;
  onSettingsChange: (settings: Partial<StorySettings>) => void;
}

export function DurationSection({ settings, onSettingsChange }: DurationSectionProps) {
  return (
    <div className="space-y-8">
      <div className="flex items-center gap-3">
        <Timer className="h-6 w-6 text-primary" />
        <h3 className="text-lg font-semibold text-gray-900">Duration & Music</h3>
      </div>
      <DurationSelector 
        selectedDuration={settings.duration} 
        onDurationSelect={(value) => onSettingsChange({ duration: value })} 
      />
      <MusicSelector
        selectedMusic={settings.music}
        onMusicSelect={(value) => onSettingsChange({ music: value })}
      />
    </div>
  );
}