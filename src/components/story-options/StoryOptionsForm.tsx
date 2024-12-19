import { Card } from "@/components/ui/card";
import type { StorySettings } from "../StoryOptions";
import { StoryCreationFlow } from "./StoryCreationFlow";

interface StoryOptionsFormProps {
  settings: StorySettings;
  onSettingsChange: (settings: Partial<StorySettings>) => void;
  onStart: (settings: StorySettings) => void;
}

export function StoryOptionsForm({ settings, onSettingsChange, onStart }: StoryOptionsFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <form 
      onSubmit={handleSubmit}
      className="min-h-[calc(100dvh-4rem)] md:min-h-0 py-4 md:py-8 space-y-6"
    >
      <Card className="p-0 md:p-6 h-full bg-transparent shadow-none">
        <StoryCreationFlow 
          settings={settings}
          onSettingsChange={onSettingsChange}
          onStart={onStart}
        />
      </Card>
    </form>
  );
}