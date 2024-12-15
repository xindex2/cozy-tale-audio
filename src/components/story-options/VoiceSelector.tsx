import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mic } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";

interface VoiceSelectorProps {
  selectedVoice: string;
  onVoiceSelect: (voice: string) => void;
}

export function VoiceSelector({ selectedVoice, onVoiceSelect }: VoiceSelectorProps) {
  const [useVoice, setUseVoice] = useState(selectedVoice !== "no-voice");

  useEffect(() => {
    setUseVoice(selectedVoice !== "no-voice");
  }, [selectedVoice]);

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
    } else if (selectedVoice === "no-voice") {
      onVoiceSelect(voices[0].id);
    }
  };

  return (
    <Card className="p-8 space-y-6 bg-white shadow-lg rounded-3xl border-0">
      <div className="flex items-center space-x-3">
        <Mic className="h-8 w-8 text-blue-500" />
        <h2 className="text-2xl font-semibold text-blue-500">Story Narration</h2>
      </div>

      <div className="space-y-6">
        <div className="flex items-center space-x-3 bg-blue-50 p-4 rounded-xl">
          <Checkbox
            id="use-voice"
            checked={useVoice}
            onCheckedChange={handleVoiceToggle}
            className="data-[state=checked]:bg-blue-500"
          />
          <Label 
            htmlFor="use-voice" 
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Enable voice narration
          </Label>
        </div>

        {useVoice && (
          <div className="space-y-3">
            <Label className="text-gray-700">Select a voice</Label>
            <Select
              value={selectedVoice}
              onValueChange={onVoiceSelect}
              disabled={!useVoice}
            >
              <SelectTrigger className="w-full p-4 text-lg bg-white border-gray-200 hover:border-blue-500 transition-colors rounded-xl">
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 rounded-xl shadow-lg">
                {voices.map((voice) => (
                  <SelectItem 
                    key={voice.id} 
                    value={voice.id}
                    className="py-3 px-4 hover:bg-blue-50 transition-colors cursor-pointer"
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-900">{voice.name}</span>
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