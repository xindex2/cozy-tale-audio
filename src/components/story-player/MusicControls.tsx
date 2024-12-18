import { Card } from "@/components/ui/card";
import { Music, Play, Pause, Loader2 } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { PlyrPlayer } from "./PlyrPlayer";
import { AudioControls } from "./AudioControls";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="w-24">Play</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {musicTracks?.map((track) => (
              <TableRow 
                key={track.id}
                className={selectedMusic === track.id ? "bg-blue-50" : undefined}
              >
                <TableCell className="font-medium">{track.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {track.category}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleMusicChange(track.id)}
                  >
                    {selectedMusic === track.id ? (
                      <Pause className="h-4 w-4" />
                    ) : (
                      <Play className="h-4 w-4" />
                    )}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

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
  );
}