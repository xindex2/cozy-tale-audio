import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Music } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PlyrPlayer } from "./PlyrPlayer";
import { AudioControls } from "./AudioControls";

interface MusicControlsProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  selectedMusic?: string;
  onMusicChange?: (musicId: string) => void;
}

interface MusicTrack {
  id: string;
  name: string;
  url: string;
  is_active: boolean;
}

export function MusicControls({
  volume,
  isMuted,
  onVolumeChange,
  onToggleMute,
  selectedMusic,
  onMusicChange
}: MusicControlsProps) {
  const [error, setError] = useState<string | null>(null);

  const { data: musicTracks, isLoading: isLoadingTracks } = useQuery({
    queryKey: ['music-library'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('music_library')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return [{ id: 'no-music', name: 'No Music', url: null }, ...(data as MusicTrack[])];
    }
  });

  const currentMusic = musicTracks?.find(track => track.id === selectedMusic);

  const handleMusicChange = (value: string) => {
    onMusicChange?.(value);
    setError(null);
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Music className="h-4 w-4 text-blue-500" />
          <h3 className="text-sm font-medium">Background Music</h3>
        </div>
        {isLoadingTracks && (
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
        )}
      </div>

      <Select 
        value={selectedMusic || "no-music"}
        onValueChange={handleMusicChange}
        disabled={isLoadingTracks}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select music">
            {currentMusic?.name || "No Music"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {musicTracks?.map((track) => (
            <SelectItem key={track.id} value={track.id}>
              {track.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      {currentMusic?.url && (
        <div className="space-y-4">
          <AudioControls
            volume={volume}
            isMuted={isMuted}
            onVolumeChange={onVolumeChange}
            onToggleMute={onToggleMute}
          />
          <PlyrPlayer
            url={currentMusic.url}
            volume={volume}
            isMuted={isMuted}
            onError={() => setError("Failed to play music")}
            showVolumeControl={false}
            isMusic={true}
          />
        </div>
      )}
    </Card>
  );
}