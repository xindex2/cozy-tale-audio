import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface ThemeSelectorProps {
  selectedTheme: string;
  onThemeSelect: (theme: string) => void;
}

export function ThemeSelector({ selectedTheme, onThemeSelect }: ThemeSelectorProps) {
  const [customTheme, setCustomTheme] = useState("");
  const [isCustom, setIsCustom] = useState(false);

  const themes = [
    "fantasy", "adventure", "animals", "space", "underwater", "fairy tales",
    "nature", "magic school", "mystery", "science fiction", "historical",
    "superhero", "mythology", "custom"
  ];

  const handleThemeSelect = (theme: string) => {
    if (theme === "custom") {
      setIsCustom(true);
      onThemeSelect(customTheme || "custom theme");
    } else {
      setIsCustom(false);
      onThemeSelect(theme);
    }
  };

  const handleCustomThemeChange = (value: string) => {
    setCustomTheme(value);
    if (isCustom) {
      onThemeSelect(value || "custom theme");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <Sparkles className="h-6 w-6 text-primary" />
        <h3 className="text-lg font-semibold text-gray-900">Story Theme</h3>
      </div>

      {isCustom && (
        <div className="mb-4">
          <Input
            placeholder="Enter your custom theme"
            value={customTheme}
            onChange={(e) => handleCustomThemeChange(e.target.value)}
            className="w-full"
          />
        </div>
      )}

      <ScrollArea className="h-[300px] w-full rounded-xl pr-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {themes.map((theme) => (
            <Button
              key={theme}
              variant={selectedTheme === theme || (theme === "custom" && isCustom) ? "default" : "outline"}
              onClick={() => handleThemeSelect(theme)}
              className={`h-12 text-base font-medium rounded-xl capitalize transition-all duration-200 ${
                (selectedTheme === theme || (theme === "custom" && isCustom))
                  ? "bg-primary hover:bg-primary/90 text-white shadow-md hover:shadow-lg"
                  : "hover:bg-primary/10 border-2"
              }`}
            >
              {theme}
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}