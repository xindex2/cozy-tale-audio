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
    <Card className="p-8 space-y-6 bg-white shadow-lg rounded-3xl border-0">
      <div className="flex items-center space-x-3">
        <Moon className="h-8 w-8 text-purple-500" />
        <h2 className="text-2xl font-semibold text-purple-500">Age Group</h2>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {ageGroups.map((age) => (
          <Button
            key={age}
            variant={selectedAge === age ? "default" : "outline"}
            onClick={() => onAgeSelect(age)}
            className={`w-full h-14 text-lg font-medium rounded-2xl transition-all duration-200 ${
              selectedAge === age 
                ? "bg-purple-500 hover:bg-purple-600 text-white shadow-md hover:shadow-lg"
                : "hover:bg-purple-50 border-2 border-purple-100"
            }`}
          >
            {age} years
          </Button>
        ))}
      </div>
    </Card>
  );
}