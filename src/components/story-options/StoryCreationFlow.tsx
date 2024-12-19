import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VoiceLanguageSelector } from "./VoiceLanguageSelector";
import { AgeGroupSelector } from "./AgeGroupSelector";
import { ThemeSelector } from "./ThemeSelector";
import { DurationSelector } from "./DurationSelector";
import { MusicSelector } from "./MusicSelector";
import { ChevronLeft, ChevronRight, Globe, Sparkles, Timer } from "lucide-react";
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
    if (!isStepComplete()) {
      return;
    }

    if (step < 3) {
      setStep(prev => prev + 1);
    } else if (step === 3) {
      onStart(settings);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const isStepComplete = () => {
    switch (step) {
      case 1:
        return Boolean(settings.language && (settings.voice || settings.voice === 'none'));
      case 2:
        return Boolean(settings.ageGroup && settings.theme);
      case 3:
        return Boolean(settings.duration > 0 && settings.music);
      default:
        return false;
    }
  };

  const getStepProgress = () => {
    let progress = 0;
    if (settings.language && (settings.voice || settings.voice === 'none')) progress++;
    if (settings.ageGroup && settings.theme) progress++;
    if (settings.duration > 0 && settings.music) progress++;
    return (progress / 3) * 100;
  };

  const steps = [
    { 
      label: 'Language & Voice',
      icon: <Globe className="w-5 h-5" />,
      description: 'Choose your story language and narration voice'
    },
    { 
      label: 'Theme & Age',
      icon: <Sparkles className="w-5 h-5" />,
      description: 'Select theme and age group'
    },
    { 
      label: 'Duration & Music',
      icon: <Timer className="w-5 h-5" />,
      description: 'Set story length and background music'
    }
  ];

  return (
    <div className="w-full mx-auto px-4 md:px-6 lg:w-[90%]">
      {/* Progress Bar and Steps */}
      <div className="mb-8 md:mb-12">
        <div className="flex justify-between mb-6">
          {steps.map((stepItem, idx) => (
            <div 
              key={stepItem.label}
              className={`flex-1 relative ${idx !== steps.length - 1 ? 'mr-4' : ''}`}
            >
              <div className={`
                flex flex-col items-center md:flex-row md:items-start
                ${idx + 1 === step ? 'text-primary' : idx + 1 < step ? 'text-green-500' : 'text-gray-400'}
              `}>
                <div className={`
                  w-10 h-10 flex items-center justify-center rounded-full mb-2 md:mb-0 md:mr-3
                  ${idx + 1 === step ? 'bg-primary text-white' : 
                    idx + 1 < step ? 'bg-green-500 text-white' : 
                    'bg-gray-200 text-gray-500'}
                `}>
                  {stepItem.icon}
                </div>
                <div className="text-center md:text-left">
                  <p className="text-sm font-medium hidden md:block">{stepItem.label}</p>
                  <p className="text-xs text-gray-500 hidden md:block">{stepItem.description}</p>
                </div>
              </div>
              {idx !== steps.length - 1 && (
                <div className="hidden md:block absolute top-5 left-full w-full h-[2px] bg-gray-200">
                  <div 
                    className="h-full bg-green-500 transition-all duration-300"
                    style={{ 
                      width: step > idx + 1 ? '100%' : 
                             step === idx + 1 && isStepComplete() ? '50%' : '0%' 
                    }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${getStepProgress()}%` }}
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
          className="space-y-8"
        >
          {step === 1 && (
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-purple-50 to-blue-50 border-0 shadow-lg rounded-3xl">
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl sm:text-3xl font-bold text-purple-800 mb-4">Choose Your Story Settings</h2>
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
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-blue-50 to-purple-50 border-0 shadow-lg rounded-3xl">
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-4">Customize Your Story</h2>
                  <p className="text-gray-600">Choose the age group and theme</p>
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
            </Card>
          )}

          {step === 3 && (
            <Card className="p-6 sm:p-8 bg-gradient-to-br from-purple-50 to-indigo-50 border-0 shadow-lg rounded-3xl">
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-2xl sm:text-3xl font-bold text-indigo-800 mb-4">Final Settings</h2>
                  <p className="text-gray-600">Choose the duration and background music</p>
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
            </Card>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between mt-8 md:mt-12">
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
        
        <Button 
          onClick={handleNext}
          disabled={!isStepComplete()}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90"
        >
          {step < 3 ? (
            <>
              Next
              <ChevronRight className="w-4 h-4" />
            </>
          ) : (
            'Create Story'
          )}
        </Button>
      </div>
    </div>
  );
}
