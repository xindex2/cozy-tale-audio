import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Music, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MusicSelectorProps {
  selectedMusic: string;
  onMusicSelect: (music: string) => void;
}

export function MusicSelector({ selectedMusic, onMusicSelect }: MusicSelectorProps) {
  const [useMusic, setUseMusic] = useState(selectedMusic !== "no-music");
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [validMusicOptions, setValidMusicOptions] = useState<string[]>([]);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement }>({});
  const { toast } = useToast();
  
  const musicOptions = [
    { 
      id: "gentle-lullaby", 
      name: "Gentle Lullaby", 
      description: "Soft and calming melody perfect for bedtime", 
      url: "/assets/gentle-lullaby.mp3"
    },
    { 
      id: "peaceful-dreams", 
      name: "Peaceful Dreams", 
      description: "Soothing lullaby for sweet dreams", 
      url: "/assets/peaceful-dreams.mp3"
    },
    { 
      id: "ocean-waves", 
      name: "Ocean Waves", 
      description: "Gentle water sounds with soft music", 
      url: "/assets/ocean-waves.mp3"
    },
    { 
      id: "soft-piano", 
      name: "Relaxing Piano", 
      description: "Soothing piano melodies", 
      url: "/assets/soft-piano.mp3"
    },
    { 
      id: "nature-sounds", 
      name: "Forest Birds", 
      description: "Peaceful forest ambiance with birds", 
      url: "/assets/nature-sounds.mp3"
    },
  ];

  useEffect(() => {
    // Initialize loading states
    const initialLoadingStates: { [key: string]: boolean } = {};
    musicOptions.forEach(option => {
      initialLoadingStates[option.id] = true;
    });
    setLoadingStates(initialLoadingStates);

    // Create and load audio elements
    musicOptions.forEach(option => {
      const audio = new Audio(option.url);
      audioRefs.current[option.id] = audio;

      audio.addEventListener('loadedmetadata', () => {
        if (audio.duration > 0) {
          setValidMusicOptions(prev => [...prev, option.id]);
        }
        setLoadingStates(prev => ({ ...prev, [option.id]: false }));
      });

      audio.addEventListener('error', () => {
        console.error(`Error loading audio for ${option.name}`);
        setLoadingStates(prev => ({ ...prev, [option.id]: false }));
        toast({
          title: "Audio Load Error",
          description: `Failed to load ${option.name}. Please check your internet connection.`,
          variant: "destructive",
        });
      });

      // Start loading the audio
      audio.load();
    });

    // Cleanup
    return () => {
      Object.values(audioRefs.current).forEach(audio => {
        audio.pause();
        audio.src = '';
      });
    };
  }, []);

  useEffect(() => {
    setUseMusic(selectedMusic !== "no-music");
  }, [selectedMusic]);

  const handleMusicToggle = (checked: boolean) => {
    setUseMusic(checked);
    if (!checked) {
      onMusicSelect("no-music");
    } else if (selectedMusic === "no-music" && validMusicOptions.length > 0) {
      onMusicSelect(validMusicOptions[0]);
    }
  };

  const handlePreview = (optionId: string) => {
    const audio = audioRefs.current[optionId];
    if (!audio) return;

    // Stop all other previews
    Object.values(audioRefs.current).forEach(a => {
      if (a !== audio) {
        a.pause();
        a.currentTime = 0;
      }
    });

    if (audio.paused) {
      audio.play().catch(error => {
        console.error("Error playing audio:", error);
        toast({
          title: "Playback Error",
          description: "Failed to play audio preview. Please try again.",
          variant: "destructive",
        });
      });
    } else {
      audio.pause();
      audio.currentTime = 0;
    }
  };

  return (
    <Card className="p-8 space-y-6 bg-white shadow-lg rounded-3xl border-0">
      <div className="flex items-center space-x-3">
        <Music className="h-8 w-8 text-blue-500" />
        <h2 className="text-2xl font-semibold text-blue-500">Background Music</h2>
      </div>

      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="use-music"
            checked={useMusic}
            onCheckedChange={handleMusicToggle}
            className="data-[state=checked]:bg-blue-500"
          />
          <Label 
            htmlFor="use-music" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Enable background music
          </Label>
        </div>

        {useMusic && (
          <RadioGroup
            value={selectedMusic}
            onValueChange={onMusicSelect}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            disabled={!useMusic}
          >
            {musicOptions.map((option) => (
              <div key={option.id} className="relative">
                <RadioGroupItem
                  value={option.id}
                  id={option.id}
                  className="peer sr-only"
                  disabled={!validMusicOptions.includes(option.id)}
                />
                <Label
                  htmlFor={option.id}
                  className={`flex flex-col p-4 border-2 rounded-xl cursor-pointer hover:bg-blue-50 
                    peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50
                    ${!validMusicOptions.includes(option.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex flex-col space-y-2">
                    <span className="font-semibold text-lg">{option.name}</span>
                    <p className="text-sm text-gray-500">{option.description}</p>
                    <div className="flex items-center justify-between mt-2">
                      <button
                        type="button"
                        onClick={() => handlePreview(option.id)}
                        className={`px-3 py-1 text-sm rounded-full 
                          ${validMusicOptions.includes(option.id) 
                            ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                        disabled={!validMusicOptions.includes(option.id)}
                      >
                        Preview
                      </button>
                      {loadingStates[option.id] && (
                        <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
                      )}
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </div>
    </Card>
  );
}