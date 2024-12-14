import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Moon } from "lucide-react";

interface AgeGroupSelectorProps {
  selectedAge: string;
  onAgeSelect: (age: string) => void;
}

export function AgeGroupSelector({ selectedAge, onAgeSelect }: AgeGroupSelectorProps) {
  const ageGroups = ["3-5", "6-8", "9-12", "adult"];

  return (
    <Card className="p-6 space-y-4 bg-white/90">
      <div className="flex items-center space-x-2 text-story-purple">
        <Moon className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Age Group</h2>
      </div>
      <div className="flex flex-wrap gap-2">
        {ageGroups.map((age) => (
          <Button
            key={age}
            variant={selectedAge === age ? "default" : "outline"}
            onClick={() => onAgeSelect(age)}
            className="flex-1"
          >
            {age} years
          </Button>
        ))}
      </div>
    </Card>
  );
}