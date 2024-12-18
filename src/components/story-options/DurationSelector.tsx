import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

interface DurationSelectorProps {
  selectedDuration: number;
  onDurationSelect: (duration: number) => void;
}

export function DurationSelector({ selectedDuration, onDurationSelect }: DurationSelectorProps) {
  const durations = [
    { label: "5 minutes", value: 5 },
    { label: "10 minutes", value: 10 },
    { label: "15 minutes", value: 15 }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="h-6 w-6 text-primary" />
        <h3 className="text-lg font-semibold text-gray-900">Story Duration</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {durations.map(({ label, value }) => (
          <Button
            key={value}
            variant={selectedDuration === value ? "default" : "outline"}
            onClick={() => onDurationSelect(value)}
            className={`w-full h-14 text-base font-medium rounded-xl transition-all duration-200 ${
              selectedDuration === value 
                ? "bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg"
                : "hover:bg-primary/10 border-2"
            }`}
          >
            {label}
          </Button>
        ))}
      </div>
    </div>
  );
}