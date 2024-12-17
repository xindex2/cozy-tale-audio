import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

type Voice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

interface VoiceSelectorProps {
  selectedVoice: Voice;
  onVoiceSelect: (voice: Voice) => void;
}

export function VoiceSelector({ selectedVoice, onVoiceSelect }: VoiceSelectorProps) {
  const voices: { id: Voice; name: string; description: string }[] = [
    {
      id: 'alloy',
      name: 'Alloy',
      description: 'Versatile, well-rounded voice'
    },
    {
      id: 'echo',
      name: 'Echo',
      description: 'Warm and engaging voice'
    },
    {
      id: 'fable',
      name: 'Fable',
      description: 'British accent, ideal for storytelling'
    },
    {
      id: 'onyx',
      name: 'Onyx',
      description: 'Deep and authoritative voice'
    },
    {
      id: 'nova',
      name: 'Nova',
      description: 'Energetic and friendly voice'
    },
    {
      id: 'shimmer',
      name: 'Shimmer',
      description: 'Clear and expressive voice'
    }
  ];

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Select a Voice</h3>
          <p className="text-sm text-gray-500">Choose the voice that will narrate your story</p>
        </div>
        
        <RadioGroup
          value={selectedVoice}
          onValueChange={(value) => onVoiceSelect(value as Voice)}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {voices.map((voice) => (
            <div key={voice.id} className="relative">
              <RadioGroupItem
                value={voice.id}
                id={voice.id}
                className="peer sr-only"
              />
              <Label
                htmlFor={voice.id}
                className="flex flex-col p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50"
              >
                <span className="font-medium">{voice.name}</span>
                <span className="text-sm text-gray-500">{voice.description}</span>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>
    </Card>
  );
}