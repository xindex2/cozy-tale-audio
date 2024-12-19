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

  return (
    <div className="w-full mx-auto px-4 md:px-6 lg:w-[90%]">
      <Card className="p-6 sm:p-8 bg-gradient-to-br from-purple-50 to-blue-50 border-0 shadow-lg rounded-3xl">
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-purple-800 mb-4">
              Create Your Story
            </h2>
            <p className="text-gray-600">
              Customize your story settings below
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            <Card className="p-6 bg-white shadow-md rounded-2xl border-0">
              <LanguageSection 
                settings={settings}
                onSettingsChange={onSettingsChange}
              />
            </Card>

            <Card className="p-6 bg-white shadow-md rounded-2xl border-0">
              <ThemeSection 
                settings={settings}
                onSettingsChange={onSettingsChange}
              />
            </Card>

            <Card className="p-6 bg-white shadow-md rounded-2xl border-0">
              <DurationSection 
                settings={settings}
                onSettingsChange={onSettingsChange}
              />
            </Card>
          </div>
        </div>
      </Card>

      <div className="flex justify-end mt-8">
        <Button 
          onClick={() => onStart(settings)}
          disabled={!isComplete()}
          className="bg-primary hover:bg-primary/90 px-8"
        >
          Create Story
        </Button>
      </div>
    </div>
  );
}