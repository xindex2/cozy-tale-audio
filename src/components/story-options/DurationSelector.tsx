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
    <Card className="p-8 space-y-6 bg-white shadow-lg rounded-3xl border-0">
      <div className="flex items-center space-x-3">
        <Clock className="h-8 w-8 text-blue-500" />
        <h2 className="text-2xl font-semibold text-blue-500">Duration</h2>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {durations.map(({ label, value }) => (
          <Button
            key={value}
            variant={selectedDuration === value ? "default" : "outline"}
            onClick={() => onDurationSelect(value)}
            className={`w-full h-14 text-lg font-medium rounded-2xl transition-all duration-200 ${
              selectedDuration === value 
                ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg"
                : "hover:bg-blue-50 border-2 border-blue-100"
            }`}
          >
            {label}
          </Button>
        ))}
      </div>
    </Card>
  );
}