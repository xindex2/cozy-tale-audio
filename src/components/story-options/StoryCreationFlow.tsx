import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VoiceLanguageSelector } from "./VoiceLanguageSelector";
import { AgeGroupSelector } from "./AgeGroupSelector";
import { ThemeSelector } from "./ThemeSelector";
import { DurationSelector } from "./DurationSelector";
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
    // Set default music to none, it can be changed in the player
    onSettingsChange({ music: 'no-music' });
    onStart(settings);
  };

  return (
    <div className="space-y-6">
      {step === 1 && (
        <Card className="p-8 bg-gradient-to-br from-purple-50 to-blue-50 border-0 shadow-lg rounded-3xl">
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-purple-800 mb-2">Step 1: Choose Your Story Settings</h2>
              <p className="text-gray-600">Select the language and voice for your story</p>
            </div>
            <VoiceLanguageSelector 
              selectedVoice={settings.voice}
              selectedLanguage={settings.language}
              onVoiceSelect={(value) => onSettingsChange({ voice: value })}
              onLanguageSelect={(value) => onSettingsChange({ language: value })} 
            />
            <div className="flex justify-end">
              <Button 
                onClick={handleNext}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-2 rounded-full"
              >
                Next Step
              </Button>
            </div>
          </div>
        </Card>
      )}

      {step === 2 && (
        <Card className="p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-lg rounded-3xl">
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-blue-800 mb-2">Step 2: Customize Your Story</h2>
              <p className="text-gray-600">Choose the age group and theme</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AgeGroupSelector 
                selectedAge={settings.ageGroup} 
                onAgeSelect={(value) => onSettingsChange({ ageGroup: value })} 
              />
              <ThemeSelector 
                selectedTheme={settings.theme} 
                onThemeSelect={(value) => onSettingsChange({ theme: value })} 
              />
            </div>
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handleBack}
                className="px-8 py-2 rounded-full"
              >
                Back
              </Button>
              <Button 
                onClick={handleNext}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-full"
              >
                Next Step
              </Button>
            </div>
          </div>
        </Card>
      )}

      {step === 3 && (
        <Card className="p-8 bg-gradient-to-br from-purple-50 to-indigo-50 border-0 shadow-lg rounded-3xl">
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-indigo-800 mb-2">Final Step: Story Duration</h2>
              <p className="text-gray-600">How long would you like your story to be?</p>
            </div>
            <DurationSelector 
              selectedDuration={settings.duration} 
              onDurationSelect={(value) => onSettingsChange({ duration: value })} 
            />
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={handleBack}
                className="px-8 py-2 rounded-full"
              >
                Back
              </Button>
              <Button 
                onClick={handleStart}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-2 rounded-full"
              >
                Create Story
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}