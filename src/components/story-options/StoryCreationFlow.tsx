import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VoiceLanguageSelector } from "./VoiceLanguageSelector";
import { AgeGroupSelector } from "./AgeGroupSelector";
import { ThemeSelector } from "./ThemeSelector";
import { DurationSelector } from "./DurationSelector";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { StorySettings } from "../StoryOptions";
import { motion, AnimatePresence } from "framer-motion";

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
    onSettingsChange({ music: 'gentle-lullaby' }); // Set default music
    onStart(settings);
  };

  const isStepComplete = () => {
    switch (step) {
      case 1:
        return settings.voice && settings.language;
      case 2:
        return settings.ageGroup && settings.theme;
      case 3:
        return settings.duration > 0;
      default:
        return false;
    }
  };

  return (
    <div className="w-full mx-auto px-0 md:max-w-2xl md:px-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm font-medium text-gray-500">
          {['Language & Voice', 'Age & Theme', 'Duration'].map((label, idx) => (
            <div 
              key={label} 
              className={`flex items-center ${idx + 1 === step ? 'text-primary' : ''}`}
            >
              <span className={`w-8 h-8 flex items-center justify-center rounded-full ${
                idx + 1 === step 
                  ? 'bg-primary text-white' 
                  : idx + 1 < step 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200'
              }`}>
                {idx + 1}
              </span>
              <span className="ml-2 hidden sm:inline">{label}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 h-2 bg-gray-200 rounded-full">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="space-y-6"
        >
          {step === 1 && (
            <Card className="p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-0 shadow-lg rounded-none sm:rounded-3xl">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl sm:text-2xl font-bold text-purple-800 mb-2">Choose Your Story Settings</h2>
                  <p className="text-gray-600">Select the language and voice for your story</p>
                </div>
                <VoiceLanguageSelector 
                  selectedVoice={settings.voice}
                  selectedLanguage={settings.language}
                  onVoiceSelect={(value) => onSettingsChange({ voice: value })}
                  onLanguageSelect={(value) => onSettingsChange({ language: value })} 
                />
              </div>
            </Card>
          )}

          {step === 2 && (
            <Card className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-lg rounded-none sm:rounded-3xl">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl sm:text-2xl font-bold text-blue-800 mb-2">Customize Your Story</h2>
                  <p className="text-gray-600">Choose the age group and theme</p>
                </div>
                <div className="grid grid-cols-1 gap-6">
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
            </Card>
          )}

          {step === 3 && (
            <Card className="p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-indigo-50 border-0 shadow-lg rounded-none sm:rounded-3xl">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl sm:text-2xl font-bold text-indigo-800 mb-2">Story Duration</h2>
                  <p className="text-gray-600">How long would you like your story to be?</p>
                </div>
                <DurationSelector 
                  selectedDuration={settings.duration} 
                  onDurationSelect={(value) => onSettingsChange({ duration: value })} 
                />
              </div>
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-8">
        {step > 1 ? (
          <Button 
            variant="outline" 
            onClick={handleBack}
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
        ) : (
          <div></div>
        )}
        
        {step < 3 ? (
          <Button 
            onClick={handleNext}
            disabled={!isStepComplete()}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button 
            onClick={handleStart}
            disabled={!isStepComplete()}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90"
          >
            Create Story
          </Button>
        )}
      </div>
    </div>
  );
}