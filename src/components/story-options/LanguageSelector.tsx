import { Card } from "@/components/ui/card";
import { Globe } from "lucide-react";

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
    { code: "hi", name: "Hindi" }
  ];

  return (
    <Card className="p-6 space-y-4 bg-white/90 backdrop-blur-sm border border-blue-100">
      <div className="flex items-center space-x-2 text-blue-600">
        <Globe className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Language</h2>
      </div>
      <select
        value={selectedLanguage}
        onChange={(e) => onLanguageSelect(e.target.value)}
        className="w-full p-2 border rounded-md bg-white/80 border-blue-100 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </Card>
  );
}