import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Music, Volume2, VolumeX, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface MusicControlsProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  selectedMusic?: string;
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

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (selectedMusic && currentMusic?.url) {
      setIsLoading(true);
      setError(null);
      
      const audio = new Audio();
      audio.src = currentMusic.url;
      
      const handleCanPlay = () => {
        setIsLoading(false);
      };
      
      const handleError = () => {
        setIsLoading(false);
        setError("Failed to load music");
      };
      
      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('error', handleError);
      
      return () => {
        audio.removeEventListener('canplay', handleCanPlay);
        audio.removeEventListener('error', handleError);
      };
    } else {
      setIsLoading(false);
    }
  }, [selectedMusic, currentMusic?.url]);

  return (
    <Card className="p-4 relative">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Music className="h-4 w-4 text-blue-500" />
            <h3 className="text-sm font-medium">Background Music</h3>
          </div>
          {(isLoading || isLoadingTracks) && (
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
          )}
        </div>

        <Select 
          value={selectedMusic || "no-music"}
          disabled={isLoading || isLoadingTracks}
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

        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="p-0 hover:bg-transparent"
            onClick={onToggleMute}
            disabled={isLoading}
          >
            {isMuted ? (
              <VolumeX className="h-4 w-4" />
            ) : (
              <Volume2 className="h-4 w-4" />
            )}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]}
            min={0}
            max={1}
            step={0.1}
            className="w-full"
            onValueChange={(value) => onVolumeChange(value[0])}
            disabled={isLoading}
          />
        </div>
      </div>
    </Card>
  );
}