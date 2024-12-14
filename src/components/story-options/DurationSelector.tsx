import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface DurationSelectorProps {
  selectedDuration: number;
  onDurationSelect: (duration: number) => void;
}

export function DurationSelector({ selectedDuration, onDurationSelect }: DurationSelectorProps) {
  const durations = [5, 10, 15, 20];

  return (
    <Card className="p-6 space-y-4 bg-white/90">
      <div className="flex items-center space-x-2 text-story-orange">
        <Clock className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Duration</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {durations.map((duration) => (
          <Button
            key={duration}
            variant={selectedDuration === duration ? "default" : "outline"}
            onClick={() => onDurationSelect(duration)}
            className="flex-1"
          >
            {duration} min
          </Button>
        ))}
      </div>
    </Card>
  );
}