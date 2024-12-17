import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Volume2, VolumeX } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

type Voice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' | 'none';

interface VoiceSelectorProps {
  selectedVoice: Voice;
  onVoiceSelect: (voice: Voice) => void;
}

export function VoiceSelector({ selectedVoice, onVoiceSelect }: VoiceSelectorProps) {
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

  return (
    <Card className="p-6 h-[250px]">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Select a Voice</h3>
          <p className="text-sm text-gray-500">Choose the voice that will narrate your story</p>
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

        <div className="flex items-center space-x-2 pt-2">
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
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            No audio narration
          </label>
        </div>
      </div>
    </Card>
  );
}