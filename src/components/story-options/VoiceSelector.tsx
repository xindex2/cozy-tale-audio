import { Card } from "@/components/ui/card";
import { Mic } from "lucide-react";

interface Voice {
  name: string;
  id: string;
}

interface VoiceSelectorProps {
  selectedVoice: string;
  onVoiceSelect: (voice: string) => void;
}

export function VoiceSelector({ selectedVoice, onVoiceSelect }: VoiceSelectorProps) {
  // Map of ElevenLabs voices with their IDs
  const voices: Voice[] = [
    { name: "Aria", id: "9BWtsMINqrJLrRacOk9x" },
    { name: "Roger", id: "CwhRBWXzGAHq8TQ4Fs17" },
    { name: "Sarah", id: "EXAVITQu4vr4xnSDxMaL" },
    { name: "Laura", id: "FGY2WhTYpPnrIDTdsKH5" },
    { name: "Charlie", id: "IKne3meq5aSn9XLyUdCD" },
    { name: "George", id: "JBFqnCBsd6RMkjVDRZzb" },
    { name: "Callum", id: "N2lVS1w4EtoT3dr4eOWO" },
    { name: "River", id: "SAz9YHcvj6GT2YYXdXww" },
    { name: "Liam", id: "TX3LPaxmHKxFdv7VOQHJ" },
    { name: "Charlotte", id: "XB0fDUnXU5powFXDhCwa" },
    { name: "Alice", id: "Xb7hH8MSUJpSbSDYk0k2" },
    { name: "Matilda", id: "XrExE9yKIg1WjnnlVkGX" },
    { name: "Will", id: "bIHbv24MWmeRgasZH58o" },
    { name: "Jessica", id: "cgSgspJ2msm6clMCkdW9" },
    { name: "Eric", id: "cjVigY5qzO86Huf0OWal" },
    { name: "Chris", id: "iP95p4xoKVk53GoZ742B" },
    { name: "Brian", id: "nPczCjzI2devNBz1zQrb" },
    { name: "Daniel", id: "onwK4e9ZLuTAKqWW03F9" },
    { name: "Lily", id: "pFZP5JQG7iQjIQuC4Bku" },
    { name: "Bill", id: "pqHfZKP75CvOlQylNhV4" }
  ];

  return (
    <Card className="p-6 space-y-4 md:col-span-2 bg-white/90 backdrop-blur-sm border border-blue-100">
      <div className="flex items-center space-x-2 text-blue-600">
        <Mic className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Voice</h2>
      </div>
      <select
        value={selectedVoice}
        onChange={(e) => onVoiceSelect(e.target.value)}
        className="w-full p-2 border rounded-md bg-white/80 border-blue-100 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
      >
        {voices.map((voice) => (
          <option key={voice.id} value={voice.id}>
            {voice.name}
          </option>
        ))}
      </select>
    </Card>
  );
}