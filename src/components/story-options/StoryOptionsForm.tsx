import { Card } from "@/components/ui/card";
import type { StorySettings } from "../StoryOptions";
import { StoryCreationFlow } from "./StoryCreationFlow";

interface StoryOptionsFormProps {
  settings: StorySettings;
  onSettingsChange: (settings: Partial<StorySettings>) => void;
  onStart: (settings: StorySettings) => void;
}

export function StoryOptionsForm({ settings, onSettingsChange, onStart }: StoryOptionsFormProps) {
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      onStart(settings);
    }} className="space-y-6 mb-8">
      <Card className="p-6">
        <StoryCreationFlow 
          settings={settings}
          onSettingsChange={onSettingsChange}
          onStart={onStart}
        />
      </Card>
    </form>
  );
}