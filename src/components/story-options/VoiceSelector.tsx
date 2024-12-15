import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Mic } from "lucide-react";

interface VoiceSelectorProps {
  selectedVoice: string;
  onVoiceSelect: (voice: string) => void;
}

export function VoiceSelector({ selectedVoice, onVoiceSelect }: VoiceSelectorProps) {
  const voices = [
    { id: "no-voice", name: "No Voice (Text Only)", description: "Read the story without narration" },
    { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah", description: "Warm and friendly female voice" },
    { id: "TX3LPaxmHKxFdv7VOQHJ", name: "Liam", description: "Gentle male storyteller" },
    { id: "XB0fDUnXU5powFXDhCwa", name: "Charlotte", description: "Soft and soothing female voice" },
  ];

  return (
    <Card className="p-8 space-y-6 bg-white shadow-lg rounded-3xl border-0">
      <div className="flex items-center space-x-3">
        <Mic className="h-8 w-8 text-blue-500" />
        <h2 className="text-2xl font-semibold text-blue-500">Narrator Voice</h2>
      </div>

      <RadioGroup
        value={selectedVoice}
        onValueChange={onVoiceSelect}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
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
              className="flex flex-col p-4 border-2 rounded-xl cursor-pointer hover:bg-blue-50 peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50"
            >
              <span className="font-semibold text-lg">{voice.name}</span>
              <span className="text-sm text-gray-500">{voice.description}</span>
            </Label>
          </div>
        ))}
      </RadioGroup>
    </Card>
  );
}