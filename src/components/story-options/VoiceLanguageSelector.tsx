import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Voice = 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';

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
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Label>Select Voice</Label>
        <RadioGroup
          value={selectedVoice}
          onValueChange={(value) => onVoiceSelect(value as Voice)}
          className="grid grid-cols-2 sm:grid-cols-3 gap-4"
        >
          <div>
            <RadioGroupItem value="alloy" id="alloy" className="peer sr-only" />
            <Label
              htmlFor="alloy"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <span>Alloy</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="echo" id="echo" className="peer sr-only" />
            <Label
              htmlFor="echo"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <span>Echo</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="fable" id="fable" className="peer sr-only" />
            <Label
              htmlFor="fable"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <span>Fable</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="onyx" id="onyx" className="peer sr-only" />
            <Label
              htmlFor="onyx"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <span>Onyx</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="nova" id="nova" className="peer sr-only" />
            <Label
              htmlFor="nova"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <span>Nova</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="shimmer" id="shimmer" className="peer sr-only" />
            <Label
              htmlFor="shimmer"
              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
            >
              <span>Shimmer</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="space-y-4">
        <Label>Select Language</Label>
        <Select value={selectedLanguage} onValueChange={onLanguageSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="es">Spanish</SelectItem>
            <SelectItem value="fr">French</SelectItem>
            <SelectItem value="de">German</SelectItem>
            <SelectItem value="it">Italian</SelectItem>
            <SelectItem value="pt">Portuguese</SelectItem>
            <SelectItem value="nl">Dutch</SelectItem>
            <SelectItem value="pl">Polish</SelectItem>
            <SelectItem value="ja">Japanese</SelectItem>
            <SelectItem value="ko">Korean</SelectItem>
            <SelectItem value="zh">Chinese</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}