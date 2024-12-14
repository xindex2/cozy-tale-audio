import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AgeGroupSelector } from "./story-options/AgeGroupSelector";
import { ThemeSelector } from "./story-options/ThemeSelector";
import { DurationSelector } from "./story-options/DurationSelector";
import { MusicSelector } from "./story-options/MusicSelector";
import { VoiceSelector } from "./story-options/VoiceSelector";

interface StoryOptionsProps {
  onStart: (options: StorySettings) => void;
}

export interface StorySettings {
  ageGroup: string;
  duration: number;
  music: string;
  voice: string;
  theme: string;
}

export function StoryOptions({ onStart }: StoryOptionsProps) {
  const [settings, setSettings] = useState<StorySettings>({
    ageGroup: "6-8",
    duration: 5,
    music: "gentle-lullaby",
    voice: "alloy",
    theme: "fantasy",
  });

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8 animate-fade-in" 
         style={{ 
           background: "linear-gradient(90deg, hsla(277, 75%, 84%, 1) 0%, hsla(297, 50%, 51%, 1) 100%)",
           borderRadius: "1rem",
           padding: "2rem"
         }}>
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-white">Bedtime Stories</h1>
        <p className="text-white/90">Customize your perfect bedtime story</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AgeGroupSelector
          selectedAge={settings.ageGroup}
          onAgeSelect={(age) => setSettings({ ...settings, ageGroup: age })}
        />
        <ThemeSelector
          selectedTheme={settings.theme}
          onThemeSelect={(theme) => setSettings({ ...settings, theme })}
        />
        <DurationSelector
          selectedDuration={settings.duration}
          onDurationSelect={(duration) => setSettings({ ...settings, duration })}
        />
        <MusicSelector
          selectedMusic={settings.music}
          onMusicSelect={(music) => setSettings({ ...settings, music })}
        />
        <VoiceSelector
          selectedVoice={settings.voice}
          onVoiceSelect={(voice) => setSettings({ ...settings, voice })}
        />
      </div>

      <Button
        onClick={() => onStart(settings)}
        className="w-full max-w-md mx-auto block mt-8 bg-story-purple hover:bg-story-purple/90 text-white"
        size="lg"
      >
        Start Story
      </Button>
    </div>
  );
}