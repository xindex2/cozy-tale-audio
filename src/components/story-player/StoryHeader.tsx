import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

interface StoryHeaderProps {
  onBack: () => void;
  title: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export function StoryHeader({
  onBack,
  title,
  isPlaying,
  onTogglePlay,
}: StoryHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
          onClick={onBack}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>
    </div>
  );
}