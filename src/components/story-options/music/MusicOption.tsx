import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";

interface MusicOptionProps {
  id: string;
  name: string;
  description: string;
  isLoading: boolean;
  isValid: boolean;
  onPreview: () => void;
}

export function MusicOption({
  id,
  name,
  description,
  isLoading,
  isValid,
  onPreview
}: MusicOptionProps) {
  return (
    <div className="relative">
      <RadioGroupItem
        value={id}
        id={id}
        className="peer sr-only"
        disabled={!isValid}
      />
      <Label
        htmlFor={id}
        className={`flex flex-col p-4 border-2 rounded-xl cursor-pointer hover:bg-blue-50 
          peer-data-[state=checked]:border-blue-500 peer-data-[state=checked]:bg-blue-50
          ${!isValid ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex flex-col space-y-2">
          <span className="font-semibold text-lg">{name}</span>
          <p className="text-sm text-gray-500">{description}</p>
          <div className="flex items-center justify-between mt-2">
            <button
              type="button"
              onClick={onPreview}
              className={`px-3 py-1 text-sm rounded-full 
                ${isValid 
                  ? 'bg-blue-100 text-blue-600 hover:bg-blue-200' 
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              disabled={!isValid}
            >
              Preview
            </button>
            {isLoading && (
              <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
            )}
          </div>
        </div>
      </Label>
    </div>
  );
}