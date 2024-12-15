import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mic } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface VoiceSelectorProps {
  selectedVoice: string;
  onVoiceSelect: (voice: string) => void;
}

export function VoiceSelector({ selectedVoice, onVoiceSelect }: VoiceSelectorProps) {
  const [useVoice, setUseVoice] = useState(selectedVoice !== "no-voice");

  const voices = [
    { id: "EXAVITQu4vr4xnSDxMaL", name: "Sarah", description: "Warm and friendly female voice" },
    { id: "TX3LPaxmHKxFdv7VOQHJ", name: "Liam", description: "Gentle male storyteller" },
    { id: "XB0fDUnXU5powFXDhCwa", name: "Charlotte", description: "Soft and soothing female voice" },
    { id: "9BWtsMINqrJLrRacOk9x", name: "Aria", description: "Clear and expressive female voice" },
    { id: "CwhRBWXzGAHq8TQ4Fs17", name: "Roger", description: "Deep and resonant male voice" },
    { id: "FGY2WhTYpPnrIDTdsKH5", name: "Laura", description: "Natural and engaging female voice" },
    { id: "IKne3meq5aSn9XLyUdCD", name: "Charlie", description: "Friendly and approachable male voice" },
    { id: "JBFqnCBsd6RMkjVDRZzb", name: "George", description: "Professional male narrator" },
    { id: "N2lVS1w4EtoT3dr4eOWO", name: "Callum", description: "Young and energetic male voice" },
    { id: "SAz9YHcvj6GT2YYXdXww", name: "River", description: "Smooth and calming voice" },
  ];

  const handleVoiceToggle = (checked: boolean) => {
    setUseVoice(checked);
    if (!checked) {
      onVoiceSelect("no-voice");
    } else {
      onVoiceSelect(voices[0].id); // Default to first voice when enabling
    }
  };

  return (
    <Card className="p-8 space-y-6 bg-white shadow-lg rounded-3xl border-0">
      <div className="flex items-center space-x-3">
        <Mic className="h-8 w-8 text-blue-500" />
        <h2 className="text-2xl font-semibold text-blue-500">Story Narration</h2>
      </div>

      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="use-voice"
            checked={useVoice}
            onCheckedChange={handleVoiceToggle}
          />
          <Label htmlFor="use-voice">Enable voice narration</Label>
        </div>

        {useVoice && (
          <div className="space-y-2">
            <Label>Select a voice</Label>
            <Select
              value={selectedVoice}
              onValueChange={onVoiceSelect}
              disabled={!useVoice}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                {voices.map((voice) => (
                  <SelectItem key={voice.id} value={voice.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{voice.name}</span>
                      <span className="text-sm text-gray-500">{voice.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>
    </Card>
  );
}