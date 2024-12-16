import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Play, Pause } from "lucide-react";

interface MusicOptionProps {
  id: string;
  name: string;
  description: string;
  isPlaying: boolean;
  onPreviewToggle: () => void;
}

export function MusicOption({ 
  id, 
  name, 
  description, 
  isPlaying, 
  onPreviewToggle 
}: MusicOptionProps) {
  return (
    <div className="relative">
      <RadioGroupItem
        value={id}
        id={id}
        className="peer sr-only"
      />
      <Label
        htmlFor={id}
        className="flex flex-col p-4 border-2 rounded-xl cursor-pointer hover:bg-blue-50 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50"
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <span className="font-semibold text-lg">{name}</span>
            <p className="text-sm text-gray-500">{description}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              onPreviewToggle();
            }}
            className="ml-2"
          >
            {isPlaying ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
        </div>
      </Label>
    </div>
  );
}