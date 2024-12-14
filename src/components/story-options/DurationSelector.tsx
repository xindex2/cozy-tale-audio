import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface DurationSelectorProps {
  selectedDuration: number;
  onDurationSelect: (duration: number) => void;
}

export function DurationSelector({ selectedDuration, onDurationSelect }: DurationSelectorProps) {
  const durations = [
    { label: "Short", value: 5 },
    { label: "Medium", value: 10 },
    { label: "Longer", value: 15 }
  ];

  return (
    <Card className="p-6 space-y-4 bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="flex items-center space-x-2 text-blue-600">
        <Clock className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Duration</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {durations.map(({ label, value }) => (
          <Button
            key={value}
            variant={selectedDuration === value ? "default" : "outline"}
            onClick={() => onDurationSelect(value)}
            className={`flex-1 ${
              selectedDuration === value
                ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                : ""
            }`}
          >
            {label}
          </Button>
        ))}
      </div>
    </Card>
  );
}