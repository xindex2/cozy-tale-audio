import { Card } from "@/components/ui/card";
import { Globe, Volume2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

type Voice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' | 'none';

interface VoiceLanguageSelectorProps {
  selectedVoice: Voice;
  selectedLanguage: string;
  onVoiceSelect: (voice: Voice) => void;
  onLanguageSelect: (language: string) => void;
}

export function VoiceLanguageSelector({ 
  selectedVoice, 
  selectedLanguage,
  onVoiceSelect,
  onLanguageSelect 
}: VoiceLanguageSelectorProps) {
  const voices: { id: Voice; name: string; icon?: React.ReactNode }[] = [
    {
      id: 'alloy',
      name: 'Alloy',
      icon: <Volume2 className="h-4 w-4" />
    },
    {
      id: 'echo',
      name: 'Echo',
      icon: <Volume2 className="h-4 w-4" />
    },
    {
      id: 'fable',
      name: 'Fable',
      icon: <Volume2 className="h-4 w-4" />
    },
    {
      id: 'onyx',
      name: 'Onyx',
      icon: <Volume2 className="h-4 w-4" />
    },
    {
      id: 'nova',
      name: 'Nova',
      icon: <Volume2 className="h-4 w-4" />
    },
    {
      id: 'shimmer',
      name: 'Shimmer',
      icon: <Volume2 className="h-4 w-4" />
    }
  ];

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
    <Card className="p-6 bg-white shadow-md">
      <div className="space-y-6">
        <h2 className="text-2xl font-semibold text-story-blue mb-6">Language and Voice</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Language Selection */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Select a Language</h3>
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
          </div>

          {/* Voice Selection */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Select a Voice</h3>
            </div>
            
            <Select 
              value={selectedVoice === 'none' ? voices[0].id : selectedVoice} 
              onValueChange={(value) => onVoiceSelect(value as Voice)}
              disabled={selectedVoice === 'none'}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                {voices.map((voice) => (
                  <SelectItem key={voice.id} value={voice.id}>
                    <div className="flex items-center gap-2">
                      {voice.icon}
                      <span>{voice.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center space-x-2 mt-3">
              <Checkbox
                id="no-audio"
                checked={selectedVoice === 'none'}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onVoiceSelect('none');
                  } else {
                    onVoiceSelect('alloy');
                  }
                }}
              />
              <label
                htmlFor="no-audio"
                className="text-sm font-medium text-gray-700 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                No audio narration
              </label>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}