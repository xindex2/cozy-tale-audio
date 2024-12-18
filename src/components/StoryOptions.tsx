import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { BookOpen, Sparkles, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useStorySettings } from "./story-options/useStorySettings";
import { StoryOptionsHeader } from "./story-options/StoryOptionsHeader";
import { StoryOptionsForm } from "./story-options/StoryOptionsForm";
import { useAuth } from "@/contexts/AuthContext";

interface StoryOptionsProps {
  onStart: (options: StorySettings) => void;
}

export interface StorySettings {
  ageGroup: string;
  duration: number;
  music: string;
  voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer';
  theme: string;
  language: string;
}

export function StoryOptions({ onStart }: StoryOptionsProps) {
  const { settings, updateSettings } = useStorySettings();
  const { user } = useAuth();

  return (
    <div className="min-h-screen w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <StoryOptionsHeader isLoggedIn={!!user} />
          
          {!user && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6 sm:my-8">
              <Card className="p-4 sm:p-6 bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg">Interactive Reading</h3>
                  <p className="text-sm text-gray-600">
                    Follow along with highlighted text as the story is narrated
                  </p>
                </div>
              </Card>

              <Card className="p-4 sm:p-6 bg-gradient-to-br from-purple-50 to-purple-100">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg">AI-Powered Quiz</h3>
                  <p className="text-sm text-gray-600">
                    Test comprehension with auto-generated questions
                  </p>
                </div>
              </Card>

              <Card className="p-4 sm:p-6 bg-gradient-to-br from-green-50 to-green-100 sm:col-span-2 lg:col-span-1">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg">Story Discussion</h3>
                  <p className="text-sm text-gray-600">
                    Chat about the story and ask questions
                  </p>
                </div>
              </Card>
            </div>
          )}

          <StoryOptionsForm 
            settings={settings}
            onSettingsChange={updateSettings}
            onStart={onStart}
          />
        </div>
      </div>
    </div>
  );
}