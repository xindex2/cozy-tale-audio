import { Card } from "@/components/ui/card";
import { Music, Play, Pause, Loader2, ChevronDown } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PlyrPlayer } from "./PlyrPlayer";
import { AudioControls } from "./AudioControls";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  category: string;
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
  const [isPlaying, setIsPlaying] = useState(true);

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

  const currentMusic = musicTracks?.find(track => track.id === selectedMusic);

  const handleMusicChange = (trackId: string) => {
    onMusicChange?.(trackId);
    setError(null);
    setIsPlaying(true);
  };

  return (
    <Card className="p-4 space-y-4 bg-white/90 backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Music className="h-4 w-4 text-blue-500" />
          <h3 className="text-sm font-medium">Background Music</h3>
        </div>
        {isLoadingTracks && (
          <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
        )}
      </div>

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between">
            <span>{currentMusic?.name || "Select music"}</span>
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-full min-w-[240px] bg-white">
          {musicTracks?.map((track) => (
            <DropdownMenuItem
              key={track.id}
              onClick={() => handleMusicChange(track.id)}
              className="flex items-center justify-between"
            >
              <span>{track.name}</span>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="capitalize">
                  {track.category}
                </Badge>
                {selectedMusic === track.id && (
                  <div className="text-blue-500">
                    {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </div>
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

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
            isPlaying={isPlaying}
            onError={() => setError("Failed to play music")}
            showVolumeControl={false}
            isMusic={true}
          />
        </div>
      )}
    </Card>