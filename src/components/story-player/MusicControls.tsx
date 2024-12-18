import { Card } from "@/components/ui/card";
import { PlyrPlayer } from "./PlyrPlayer";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Music } from "lucide-react";

interface MusicControlsProps {
  volume: number;
  isMuted: boolean;
  onVolumeChange: (volume: number) => void;
  onToggleMute: () => void;
  selectedMusic?: string;
}

const musicOptions = [
  { id: "no-music", name: "No Music", url: null },
  { id: "sleeping-lullaby", name: "Sleeping Lullaby", url: "/assets/gentle-lullaby.mp3" },
  { id: "water-dreams", name: "Water Dreams", url: "/assets/ocean-waves.mp3" },
  { id: "forest-birds", name: "Nature Sounds", url: "/assets/nature-sounds.mp3" },
  { id: "relaxing-piano", name: "Relaxing Piano", url: "/assets/soft-piano.mp3" },
  { id: "gentle-dreams", name: "Peaceful Dreams", url: "/assets/peaceful-dreams.mp3" },
];

export function MusicControls({
  volume,
  isMuted,
  selectedMusic,
}: MusicControlsProps) {
  if (!selectedMusic) return null;

  const currentMusic = musicOptions.find(option => option.url === selectedMusic);

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Music className="h-4 w-4 text-blue-500" />
          <h3 className="text-sm font-medium">Background Music</h3>
        </div>

        <Select value={selectedMusic || "no-music"}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select music">
              {currentMusic?.name || "No Music"}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {musicOptions.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {selectedMusic && (
          <PlyrPlayer
            url={selectedMusic}
            volume={volume}
            isMuted={isMuted}
            isPlaying={true}
            isMusic={true}
          />
        )}
      </div>
    </Card>
  );
}