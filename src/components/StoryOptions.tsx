import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Moon, Clock, Music, Mic, Sparkles, Play, Pause, Volume2 } from "lucide-react";
import { Slider } from "@/components/ui/slider";

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
  const [previewVolume, setPreviewVolume] = useState(0.5);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const ageGroups = ["3-5", "6-8", "9-12", "adult"];
  const durations = [5, 10, 15, 20];
  const voices = ["alloy", "echo", "shimmer", "ash", "ballad", "coral", "sage", "verse"];
  const themes = [
    "fantasy", "adventure", "animals", "space", "underwater", "fairy tales",
    "nature", "magic school", "mystery", "science fiction", "historical",
    "romance", "horror", "comedy", "drama", "thriller", "western", "mythology"
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

  const togglePreview = async (musicId: string) => {
    if (!audioRef.current) {
      audioRef.current = new Audio(`/assets/${musicId}.mp3`);
      audioRef.current.loop = true;
      audioRef.current.volume = previewVolume;
    }

    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else if (audioRef.current) {
      try {
        await audioRef.current.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    }
  };

  const handleVolumeChange = (newVolume: number[]) => {
    setPreviewVolume(newVolume[0]);
    if (audioRef.current) {
      audioRef.current.volume = newVolume[0];
    }
  };

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
          <ScrollArea className="h-48 w-full rounded-md">
            <div className="grid grid-cols-2 gap-2 pr-4">
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
          </ScrollArea>
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
              <div key={option.id} className="flex flex-col gap-2">
                <Button
                  variant={settings.music === option.id ? "default" : "outline"}
                  onClick={() => setSettings({ ...settings, music: option.id })}
                  className="text-sm"
                >
                  {option.name}
                </Button>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => togglePreview(option.id)}
                    className="h-8 w-8 p-0"
                  >
                    {isPlaying && settings.music === option.id ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                  <Slider
                    value={[previewVolume]}
                    max={1}
                    step={0.1}
                    onValueChange={handleVolumeChange}
                    className="w-20"
                  />
                </div>
              </div>
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