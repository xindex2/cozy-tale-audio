import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles } from "lucide-react";

interface ThemeSelectorProps {
  selectedTheme: string;
  onThemeSelect: (theme: string) => void;
}

export function ThemeSelector({ selectedTheme, onThemeSelect }: ThemeSelectorProps) {
  const themes = [
    "fantasy", "adventure", "animals", "space", "underwater", "fairy tales",
    "nature", "magic school", "mystery", "science fiction", "historical",
    "romance", "horror", "comedy", "drama", "thriller", "western", "mythology",
    "superhero", "dystopian", "steampunk", "cyberpunk", "time travel"
  ];

  return (
    <Card className="p-8 space-y-6 bg-white shadow-lg rounded-3xl border-0">
      <div className="flex items-center space-x-3">
        <Sparkles className="h-8 w-8 text-blue-500" />
        <h2 className="text-2xl font-semibold text-blue-500">Theme</h2>
      </div>
      <ScrollArea className="h-[400px] w-full rounded-xl pr-4">
        <div className="grid grid-cols-2 gap-4">
          {themes.map((theme) => (
            <Button
              key={theme}
              variant={selectedTheme === theme ? "default" : "outline"}
              onClick={() => onThemeSelect(theme)}
              className={`h-14 text-base font-medium rounded-2xl capitalize transition-all duration-200 ${
                selectedTheme === theme 
                  ? "bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg"
                  : "hover:bg-blue-50 border-2 border-blue-100"
              }`}
            >
              {theme}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}