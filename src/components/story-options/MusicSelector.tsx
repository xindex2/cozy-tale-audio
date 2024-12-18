import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { RadioGroup } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Music } from "lucide-react";
import { MusicOption } from "./music/MusicOption";
import { useAudioPreview } from "./music/useAudioPreview";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

interface MusicSelectorProps {
  selectedMusic: string;
  onMusicSelect: (music: string) => void;
}

interface MusicTrack {
  id: string;
  name: string;
  description: string;
  url: string;
}

export function MusicSelector({ selectedMusic, onMusicSelect }: MusicSelectorProps) {
  const [useMusic, setUseMusic] = useState(selectedMusic !== "no-music");
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [validMusicOptions, setValidMusicOptions] = useState<string[]>([]);
  const { handlePreview } = useAudioPreview();

  const { data: musicTracks, isLoading: isLoadingTracks } = useQuery({
    queryKey: ['music-library'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('music_library')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return data as MusicTrack[];
    }
  });

  const musicOptions = [
    {
      id: "no-music",
      name: "No Music",
      description: "Play the story without background music",
      url: null
    },
    ...(musicTracks?.map(track => ({
      id: track.id,
      name: track.name,
      description: track.description || '',
      url: track.url
    })) || [])
  ];

  useEffect(() => {
    // Initialize loading states
    const initialLoadingStates: { [key: string]: boolean } = {};
    musicOptions.forEach(option => {
      if (option.url) {
        initialLoadingStates[option.id] = true;
      } else {
        initialLoadingStates[option.id] = false;
      }
    });
    setLoadingStates(initialLoadingStates);

    // Validate each music option
    musicOptions.forEach(option => {
      if (!option.url) {
        setValidMusicOptions(prev => [...prev, option.id]);
        return;
      }

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

      audio.load();
    });
  }, [musicTracks]);

  useEffect(() => {
    setUseMusic(selectedMusic !== "no-music");
  }, [selectedMusic]);

  const handleMusicToggle = (checked: boolean) => {
    setUseMusic(checked);
    if (!checked) {
      onMusicSelect("no-music");
    } else if (selectedMusic === "no-music" && validMusicOptions.length > 0) {
      const firstValidMusic = validMusicOptions.find(id => id !== "no-music");
      if (firstValidMusic) {
        onMusicSelect(firstValidMusic);
      }
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
                onPreview={option.url ? () => handlePreview(option.url!) : undefined}
              />
            ))}
          </RadioGroup>
        )}
      </div>
    </Card>
  );
}