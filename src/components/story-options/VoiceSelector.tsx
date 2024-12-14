import { Card } from "@/components/ui/card";
import { Mic } from "lucide-react";

interface VoiceSelectorProps {
  selectedVoice: string;
  onVoiceSelect: (voice: string) => void;
}

export function VoiceSelector({ selectedVoice, onVoiceSelect }: VoiceSelectorProps) {
  // Gemini 2.0 currently supports basic text-to-speech without specific voice selection
  // We'll provide a simple toggle for enabling/disabling speech
  const voices = ["default"];

  return (
    <Card className="p-6 space-y-4 md:col-span-2 bg-white/90">
      <div className="flex items-center space-x-2 text-story-purple">
        <Mic className="h-5 w-5" />
        <h2 className="text-xl font-semibold">Text-to-Speech</h2>
      </div>
      <select
        value={selectedVoice}
        onChange={(e) => onVoiceSelect(e.target.value)}
        className="w-full p-2 border rounded-md"
      >
        {voices.map((voice) => (
          <option key={voice} value={voice}>
            Default Voice
          </option>
        ))}
      </select>
    </Card>
  );
}