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
    <Card className="p-6 space-y-4 bg-gradient-to-r from-blue-50 to-blue-100">
      <div className="flex items-center space-x-2 text-blue-600">
        <Sparkles className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Theme</h2>
      </div>
      <ScrollArea className="h-[300px] w-full rounded-md p-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 pr-4">
          {themes.map((theme) => (
            <Button
              key={theme}
              variant={selectedTheme === theme ? "default" : "outline"}
              onClick={() => onThemeSelect(theme)}
              className="capitalize bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
            >
              {theme}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}