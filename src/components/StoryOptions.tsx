import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Moon, Clock, Music, Mic } from "lucide-react";

interface StoryOptionsProps {
  onStart: (options: StorySettings) => void;
}

export interface StorySettings {
  ageGroup: string;
  duration: number;
  music: boolean;
  voice: string;
}

export function StoryOptions({ onStart }: StoryOptionsProps) {
  const [settings, setSettings] = useState<StorySettings>({
    ageGroup: "6-8",
    duration: 5,
    music: true,
    voice: "alloy",
  });

  const ageGroups = ["3-5", "6-8", "9-12"];
  const durations = [5, 10, 15];
  const voices = ["alloy", "echo", "shimmer", "ash", "ballad", "coral", "sage", "verse"];

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8 animate-fade-in">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-story-purple">Bedtime Stories</h1>
        <p className="text-muted-foreground">Customize your perfect bedtime story</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4">
          <div className="flex items-center space-x-2 text-story-purple">
            <Moon className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Age Group</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {ageGroups.map((age) => (
              <Button
                key={age}
                variant={settings.ageGroup === age ? "default" : "outline"}
                onClick={() => setSettings({ ...settings, ageGroup: age })}
                className="flex-1"
              >
                {age} years
              </Button>
            ))}
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center space-x-2 text-story-orange">
            <Clock className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Duration</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {durations.map((duration) => (
              <Button
                key={duration}
                variant={settings.duration === duration ? "default" : "outline"}
                onClick={() => setSettings({ ...settings, duration })}
                className="flex-1"
              >
                {duration} min
              </Button>
            ))}
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center space-x-2 text-story-blue">
            <Music className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Background Music</h2>
          </div>
          <Button
            variant={settings.music ? "default" : "outline"}
            onClick={() => setSettings({ ...settings, music: !settings.music })}
            className="w-full"
          >
            {settings.music ? "On" : "Off"}
          </Button>
        </Card>

        <Card className="p-6 space-y-4">
          <div className="flex items-center space-x-2 text-story-purple">
            <Mic className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Voice</h2>
          </div>
          <select
            value={settings.voice}
            onChange={(e) => setSettings({ ...settings, voice: e.target.value })}
            className="w-full p-2 border rounded-md"
          >
            {voices.map((voice) => (
              <option key={voice} value={voice}>
                {voice.charAt(0).toUpperCase() + voice.slice(1)}
              </option>
            ))}
          </select>
        </Card>
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