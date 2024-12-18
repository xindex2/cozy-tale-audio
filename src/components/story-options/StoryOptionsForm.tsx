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
    <form 
      onSubmit={(e) => {
        e.preventDefault();
        onStart(settings);
      }} 
      className="min-h-[100dvh] md:min-h-0 space-y-6 mb-8"
    >
      <Card className="p-0 md:p-6 h-full">
        <StoryCreationFlow 
          settings={settings}
          onSettingsChange={onSettingsChange}
          onStart={onStart}
        />
      </Card>
    </form>
  );
}