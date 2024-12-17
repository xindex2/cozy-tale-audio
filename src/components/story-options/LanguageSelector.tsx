import { Card } from "@/components/ui/card";
import { Globe } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageSelect: (language: string) => void;
}

export function LanguageSelector({ selectedLanguage, onLanguageSelect }: LanguageSelectorProps) {
  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "pt", name: "Portuguese" },
    { code: "nl", name: "Dutch" },
    { code: "pl", name: "Polish" },
    { code: "hi", name: "Hindi" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "zh", name: "Chinese" },
    { code: "ru", name: "Russian" },
    { code: "ar", name: "Arabic" },
    { code: "tr", name: "Turkish" }
  ];

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Select a Language</h3>
          <p className="text-sm text-gray-500">Choose the language for your story</p>
        </div>
        
        <Select value={selectedLanguage} onValueChange={onLanguageSelect}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  <span>{lang.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="bg-purple-50 p-4 rounded-xl shadow-sm">
          <p className="text-base text-gray-700 leading-relaxed">
            <span className="font-bold text-story-purple">🌍 Language Selection:</span> When you choose a language, 
            both the story text and available voice options will adjust to match your selected language.
          </p>
        </div>
      </div>
    </Card>
  );
}