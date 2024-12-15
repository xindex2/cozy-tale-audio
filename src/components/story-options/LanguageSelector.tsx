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
    <div className="space-y-4">
      <Card className="p-8 space-y-6 bg-white shadow-lg rounded-3xl border-0">
        <div className="flex items-center space-x-3">
          <Globe className="h-8 w-8 text-blue-500" />
          <h2 className="text-2xl font-semibold text-blue-500">Language</h2>
        </div>
        <Select value={selectedLanguage} onValueChange={onLanguageSelect}>
          <SelectTrigger className="w-full p-4 text-lg bg-white">
            <SelectValue placeholder="Select a language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>
      <div className="bg-purple-50 p-4 rounded-xl shadow-sm">
        <p className="text-base text-gray-700 leading-relaxed">
          <span className="font-bold text-story-purple">🌍 Language Selection:</span> When you choose a language, 
          both the story text and available voice options will adjust to match your selected language.
        </p>
      </div>
    </div>
  );
}