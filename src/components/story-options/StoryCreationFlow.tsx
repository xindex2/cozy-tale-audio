import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VoiceLanguageSelector } from "./VoiceLanguageSelector";
import { AgeGroupSelector } from "./AgeGroupSelector";
import { ThemeSelector } from "./ThemeSelector";
import { DurationSelector } from "./DurationSelector";
import { MusicSelector } from "./MusicSelector";
import type { StorySettings } from "../StoryOptions";

interface StoryCreationFlowProps {
  settings: StorySettings;
  onSettingsChange: (settings: Partial<StorySettings>) => void;
  onStart: (settings: StorySettings) => void;
}

export function StoryCreationFlow({ settings, onSettingsChange, onStart }: StoryCreationFlowProps) {
  const [step, setStep] = useState(1);

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleStart = () => {
    onStart(settings);
  };

  return (
    <div className="space-y-6">
      {step === 1 && (
        <Card className="p-6">
          <div className="space-y-6">
            <VoiceLanguageSelector 
              selectedVoice={settings.voice}
              selectedLanguage={settings.language}
              onVoiceSelect={(value) => onSettingsChange({ voice: value })}
              onLanguageSelect={(value) => onSettingsChange({ language: value })}
            />
            <AgeGroupSelector 
              selectedAge={settings.ageGroup} 
              onAgeSelect={(value) => onSettingsChange({ ageGroup: value })} 
            />
            <div className="flex justify-end">
              <Button onClick={handleNext}>Next</Button>
            </div>
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card className="p-6">
          <div className="space-y-6">
            <ThemeSelector 
              selectedTheme={settings.theme} 
              onThemeSelect={(value) => onSettingsChange({ theme: value })} 
            />
            <DurationSelector 
              selectedDuration={settings.duration} 
              onDurationSelect={(value) => onSettingsChange({ duration: value })} 
            />
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>Back</Button>
              <Button onClick={handleNext}>Next</Button>
            </div>
          </div>
        </Card>
      )}

      {step === 3 && (
        <Card className="p-6">
          <div className="space-y-6">
            <MusicSelector 
              selectedMusic={settings.music} 
              onMusicSelect={(value) => onSettingsChange({ music: value })} 
            />
            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>Back</Button>
              <Button onClick={handleStart}>Start Story</Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}