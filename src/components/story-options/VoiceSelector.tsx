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
    { name: "Sarah", id: "EXAVITQu4vr4xnSDxMaL" },
    { name: "Charlotte", id: "XB0fDUnXU5powFXDhCwa" },
    { name: "Lily", id: "pFZP5JQG7iQjIQuC4Bku" },
    { name: "Jessica", id: "cgSgspJ2msm6clMCkdW9" }
  ];

  return (
    <Card className="p-6 space-y-4 md:col-span-2 bg-white/90">
      <div className="flex items-center space-x-2 text-story-purple">
        <Mic className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Voice</h2>
      </div>
      <select
        value={selectedVoice}
        onChange={(e) => onVoiceSelect(e.target.value)}
        className="w-full p-2 border rounded-md"
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