import { Card } from "@/components/ui/card";
import { Globe, Volume2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

type Voice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' | 'none';

interface VoiceLanguageSelectorProps {
  selectedVoice: Voice;
  onVoiceSelect: (voice: Voice) => void;
  selectedLanguage: string;
  onLanguageSelect: (language: string) => void;
}

export function VoiceLanguageSelector({ 
  selectedVoice, 
  onVoiceSelect,
  selectedLanguage,
  onLanguageSelect 
}: VoiceLanguageSelectorProps) {
  const voices: { id: Voice; name: string; description: string; icon?: React.ReactNode }[] = [
    {
      id: 'alloy',
      name: 'Alloy',
      description: 'Versatile, well-rounded voice',
      icon: <Volume2 className="h-4 w-4" />
    },
    {
      id: 'echo',
      name: 'Echo',
      description: 'Warm and engaging voice',
      icon: <Volume2 className="h-4 w-4" />
    },
    {
      id: 'fable',
      name: 'Fable',
      description: 'British accent, ideal for storytelling',
      icon: <Volume2 className="h-4 w-4" />
    },
    {
      id: 'onyx',
      name: 'Onyx',
      description: 'Deep and authoritative voice',
      icon: <Volume2 className="h-4 w-4" />
    },
    {
      id: 'nova',
      name: 'Nova',
      description: 'Energetic and friendly voice',
      icon: <Volume2 className="h-4 w-4" />
    },
    {
      id: 'shimmer',
      name: 'Shimmer',
      description: 'Clear and expressive voice',
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
          {/* Language Selection - Now on the left */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Select a Language</h3>
              <p className="text-sm text-gray-600 mb-3">Choose the language for your story</p>
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

          {/* Voice Selection - Now on the right */}
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Select a Voice</h3>
              <p className="text-sm text-gray-600 mb-3">Choose the voice that will narrate your story</p>
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
                      <div>
                        <div className="font-medium">{voice.name}</div>
                        <div className="text-xs text-gray-500">{voice.description}</div>
                      </div>
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

        {/* Combined Notes Section */}
        <div className="mt-6">
          <div className="bg-purple-50 p-4 rounded-xl shadow-sm">
            <p className="text-base text-gray-700 leading-relaxed">
              <span className="font-bold text-story-purple">🌍 Language Selection:</span> When you choose a language, 
              both the story text and available voice options will adjust to match your selected language.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}