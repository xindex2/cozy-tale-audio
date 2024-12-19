import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { StorySettings } from "../StoryOptions";
import { LanguageSection } from "./sections/LanguageSection";
import { ThemeSection } from "./sections/ThemeSection";
import { DurationSection } from "./sections/DurationSection";

interface StoryCreationFlowProps {
  settings: StorySettings;
  onSettingsChange: (settings: Partial<StorySettings>) => void;
  onStart: (settings: StorySettings) => void;
}

export function StoryCreationFlow({ settings, onSettingsChange, onStart }: StoryCreationFlowProps) {
  const isComplete = () => {
    return Boolean(
      settings.language && 
      (settings.voice || settings.voice === 'none') &&
      settings.ageGroup && 
      settings.theme &&
      settings.duration > 0 && 
      settings.music
    );
  };

  const handleStartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isComplete()) {
      onStart(settings);
    }
  };

  return (
    <div className="w-full mx-auto px-4 md:px-6 lg:w-[90%]">
      <Card className="p-4 sm:p-6 md:p-8 bg-gradient-to-br from-purple-50 to-blue-50 border-0 shadow-lg rounded-3xl">
        <div className="space-y-8 md:space-y-12">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-purple-800 mb-4">
              Create Your Story
            </h2>
            <p className="text-gray-600">
              Customize your story settings below
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
            <Card className="p-4 sm:p-6 bg-white shadow-md rounded-2xl border-0">
              <LanguageSection 
                settings={settings}
                onSettingsChange={onSettingsChange}
              />
            </Card>

            <Card className="p-4 sm:p-6 bg-white shadow-md rounded-2xl border-0">
              <ThemeSection 
                settings={settings}
                onSettingsChange={onSettingsChange}
              />
            </Card>

            <Card className="p-4 sm:p-6 bg-white shadow-md rounded-2xl border-0 md:col-span-2 lg:col-span-1">
              <DurationSection 
                settings={settings}
                onSettingsChange={onSettingsChange}
              />
            </Card>
          </div>
        </div>
      </Card>

      <div className="flex justify-center sm:justify-end mt-6 sm:mt-8">
        <Button 
          onClick={handleStartClick}
          disabled={!isComplete()}
          className="w-full sm:w-auto bg-primary hover:bg-primary/90 px-8 py-6 text-lg"
        >
          Create Story
        </Button>
      </div>
    </div>
  );
}