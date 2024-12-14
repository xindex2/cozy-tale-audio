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
    "romance", "horror", "comedy", "drama", "thriller", "western", "mythology"
  ];

  return (
    <Card className="p-6 space-y-4 bg-white/90">
      <div className="flex items-center space-x-2 text-story-orange">
        <Sparkles className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Theme</h2>
      </div>
      <ScrollArea className="h-48 w-full rounded-md">
        <div className="grid grid-cols-2 gap-2 pr-4">
          {themes.map((theme) => (
            <Button
              key={theme}
              variant={selectedTheme === theme ? "default" : "outline"}
              onClick={() => onThemeSelect(theme)}
              className="capitalize"
            >
              {theme}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}