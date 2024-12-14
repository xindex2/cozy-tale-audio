import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Moon, Clock, Music, Mic, Sparkles } from "lucide-react";

interface StoryOptionsProps {
  onStart: (options: StorySettings) => void;
}

export interface StorySettings {
  ageGroup: string;
  duration: number;
  music: string;
  voice: string;
  theme: string;
}

export function StoryOptions({ onStart }: StoryOptionsProps) {
  const [settings, setSettings] = useState<StorySettings>({
    ageGroup: "6-8",
    duration: 5,
    music: "gentle-lullaby",
    voice: "alloy",
    theme: "fantasy",
  });

  const ageGroups = ["3-5", "6-8", "9-12", "adult"];
  const durations = [5, 10, 15, 20];
  const voices = ["alloy", "echo", "shimmer", "ash", "ballad", "coral", "sage", "verse"];
  const themes = [
    "fantasy",
    "adventure",
    "animals",
    "space",
    "underwater",
    "fairy tales",
    "nature",
    "magic school",
    "mystery",
    "science fiction",
    "historical",
    "romance",
    "horror",
    "comedy",
    "drama",
    "thriller",
    "western",
    "mythology"
  ];
  const musicOptions = [
    { id: "gentle-lullaby", name: "Gentle Lullaby" },
    { id: "peaceful-dreams", name: "Peaceful Dreams" },
    { id: "nature-sounds", name: "Nature Sounds" },
    { id: "ocean-waves", name: "Ocean Waves" },
    { id: "soft-piano", name: "Soft Piano" },
    { id: "meditation", name: "Meditation" },
    { id: "ambient", name: "Ambient" },
    { id: "classical", name: "Classical" }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-8 animate-fade-in" 
         style={{ 
           background: "linear-gradient(90deg, hsla(277, 75%, 84%, 1) 0%, hsla(297, 50%, 51%, 1) 100%)",
           borderRadius: "1rem",
           padding: "2rem"
         }}>
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-white">Bedtime Stories</h1>
        <p className="text-white/90">Customize your perfect bedtime story</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 space-y-4 bg-white/90">
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

        <Card className="p-6 space-y-4 bg-white/90">
          <div className="flex items-center space-x-2 text-story-orange">
            <Sparkles className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Theme</h2>
          </div>
          <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
            {themes.map((theme) => (
              <Button
                key={theme}
                variant={settings.theme === theme ? "default" : "outline"}
                onClick={() => setSettings({ ...settings, theme })}
                className="capitalize"
              >
                {theme}
              </Button>
            ))}
          </div>
        </Card>

        <Card className="p-6 space-y-4 bg-white/90">
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

        <Card className="p-6 space-y-4 bg-white/90">
          <div className="flex items-center space-x-2 text-story-blue">
            <Music className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Background Music</h2>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {musicOptions.map((option) => (
              <Button
                key={option.id}
                variant={settings.music === option.id ? "default" : "outline"}
                onClick={() => setSettings({ ...settings, music: option.id })}
                className="text-sm"
              >
                {option.name}
              </Button>
            ))}
          </div>
        </Card>

        <Card className="p-6 space-y-4 md:col-span-2 bg-white/90">
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