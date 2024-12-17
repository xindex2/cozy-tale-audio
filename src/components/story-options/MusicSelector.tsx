import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { RadioGroup } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Music } from "lucide-react";
import { MusicOption } from "./music/MusicOption";
import { useAudioPreview } from "./music/useAudioPreview";

interface MusicSelectorProps {
  selectedMusic: string;
  onMusicSelect: (music: string) => void;
}

export function MusicSelector({ selectedMusic, onMusicSelect }: MusicSelectorProps) {
  const [useMusic, setUseMusic] = useState(selectedMusic !== "no-music");
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [validMusicOptions, setValidMusicOptions] = useState<string[]>([]);
  const { handlePreview } = useAudioPreview();
  
  const musicOptions = [
    { 
      id: "sleeping-lullaby", 
      name: "Sleeping Lullaby", 
      description: "Gentle lullaby for peaceful sleep", 
      url: "https://cdn.pixabay.com/download/audio/2023/05/16/audio_166b9c7242.mp3"
    },
    { 
      id: "water-dreams", 
      name: "Water Dreams", 
      description: "Calming water sounds with soft music", 
      url: "https://cdn.pixabay.com/download/audio/2022/02/23/audio_ea70ad08e3.mp3"
    },
    { 
      id: "forest-birds", 
      name: "Forest Birds", 
      description: "Peaceful forest ambiance with birds", 
      url: "https://cdn.pixabay.com/download/audio/2022/02/12/audio_8ca49a7f20.mp3"
    },
    { 
      id: "relaxing-piano", 
      name: "Relaxing Piano", 
      description: "Soft piano melodies for bedtime", 
      url: "https://cdn.pixabay.com/download/audio/2024/11/04/audio_4956b4edd1.mp3"
    },
    { 
      id: "gentle-lullaby", 
      name: "Gentle Lullaby", 
      description: "Soft and calming melody for sweet dreams", 
      url: "https://cdn.pixabay.com/download/audio/2023/09/05/audio_168a3e0caa.mp3"
    },
  ];

  useEffect(() => {
    // Initialize loading states
    const initialLoadingStates: { [key: string]: boolean } = {};
    musicOptions.forEach(option => {
      initialLoadingStates[option.id] = true;
    });
    setLoadingStates(initialLoadingStates);

    // Validate each music option
    musicOptions.forEach(option => {
      const audio = new Audio(option.url);
      
      audio.addEventListener('loadedmetadata', () => {
        if (audio.duration > 0) {
          setValidMusicOptions(prev => [...prev, option.id]);
        }
        setLoadingStates(prev => ({ ...prev, [option.id]: false }));
      });

      audio.addEventListener('error', () => {
        console.error(`Error loading audio for ${option.name}`);
        setLoadingStates(prev => ({ ...prev, [option.id]: false }));
      });

      // Start loading the audio
      audio.load();
    });
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
              <MusicOption
                key={option.id}
                id={option.id}
                name={option.name}
                description={option.description}
                isLoading={loadingStates[option.id]}
                isValid={validMusicOptions.includes(option.id)}
                onPreview={() => handlePreview(option.url)}
              />
            ))}
          </RadioGroup>
        )}
      </div>
    </Card>
  );
}