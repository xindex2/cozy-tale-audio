import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Play, Pause, Volume2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface MusicTrack {
  id: string;
  name: string;
  description: string | null;
  url: string;
  category: string;
  is_active: boolean;
}

export function MusicLibraryTable() {
  const [playingTrack, setPlayingTrack] = useState<string | null>(null);
  const [audio] = useState(new Audio());
  const { toast } = useToast();

  const { data: tracks, isLoading } = useQuery({
    queryKey: ['music-library'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('music_library')
        .select('*')
        .order('name');
      
      if (error) {
        toast({
          title: "Error",
          description: "Failed to load music library",
          variant: "destructive",
        });
        throw error;
      }
      return data as MusicTrack[];
    }
  });

  const handlePlayPause = (track: MusicTrack) => {
    if (playingTrack === track.id) {
      audio.pause();
      setPlayingTrack(null);
    } else {
      if (playingTrack) {
        audio.pause();
      }
      audio.src = track.url;
      audio.play().catch(error => {
        console.error('Error playing audio:', error);
        toast({
          title: "Error",
          description: "Failed to play audio track",
          variant: "destructive",
        });
      });
      setPlayingTrack(track.id);
    }
  };

  if (isLoading) {
    return <div>Loading music library...</div>;
  }

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Preview</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tracks?.map((track) => (
            <TableRow key={track.id}>
              <TableCell className="font-medium">{track.name}</TableCell>
              <TableCell>{track.description}</TableCell>
              <TableCell>
                <Badge variant="secondary" className="capitalize">
                  {track.category}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant={track.is_active ? "success" : "secondary"}>
                  {track.is_active ? "Active" : "Inactive"}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handlePlayPause(track)}
                >
                  {playingTrack === track.id ? (
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
  );
}