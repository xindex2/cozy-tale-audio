import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AgeGroupSelector } from "./story-options/AgeGroupSelector";
import { ThemeSelector } from "./story-options/ThemeSelector";
import { DurationSelector } from "./story-options/DurationSelector";
import { MusicSelector } from "./story-options/MusicSelector";
import { VoiceSelector } from "./story-options/VoiceSelector";
import { LanguageSelector } from "./story-options/LanguageSelector";
import { Play, BookOpen, Sparkles, MessageCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StoryOptionsProps {
  onStart: (options: StorySettings) => void;
}

export interface StorySettings {
  ageGroup: string;
  duration: number;
  music: string;
  voice: string;
  theme: string;
  language: string;
}

export function StoryOptions({ onStart }: StoryOptionsProps) {
  const [settings, setSettings] = useState<StorySettings>({
    ageGroup: "6-8",
    duration: 5,
    music: "no-music",
    voice: "EXAVITQu4vr4xnSDxMaL",
    theme: "fantasy",
    language: "en"
  });

  return (
    <div>
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-4 space-y-4 pt-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-[#1a237e] via-[#1565c0] to-[#0288d1] bg-clip-text text-transparent">
              Bedtime Stories AI
            </h1>

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-blue-100">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg">Interactive Reading</h3>
                  <p className="text-sm text-gray-600">
                    Follow along with highlighted text as the story is narrated
                  </p>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-purple-50 to-purple-100">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-lg">AI-Powered Quiz</h3>
                  <p className="text-sm text-gray-600">
                    Test comprehension with auto-generated questions
                  </p>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-green-50 to-green-100">
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-lg">Story Discussion</h3>
                  <p className="text-sm text-gray-600">
                    Chat about the story and ask questions
                  </p>
                </div>
              </Card>
            </div>

            <div className="space-y-6">
              <p className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-story-purple to-story-blue bg-clip-text text-transparent">
                Welcome to the Future of Bedtime Stories! 🌟
              </p>
              
              <div className="space-y-4">
                <p className="text-lg sm:text-xl text-gray-800 max-w-3xl mx-auto leading-relaxed">
                  Transform bedtime into an <span className="font-bold text-story-purple">magical adventure</span> with our 
                  <span className="bg-gradient-to-r from-story-purple to-story-blue bg-clip-text text-transparent font-bold"> AI-powered storytelling</span> that adapts perfectly to your child's world!
                </p>
                
                <div className="bg-blue-50 p-6 rounded-xl shadow-sm max-w-3xl mx-auto">
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                    <span className="font-bold text-story-blue">✨ How it works:</span> Simply choose your perfect story settings below - 
                    <span className="font-semibold text-story-purple">age group</span>, 
                    <span className="font-semibold text-story-orange">story duration</span>, 
                    <span className="font-semibold text-story-blue">voice</span>, and 
                    <span className="font-semibold text-story-purple">theme</span>. Our AI crafts a 
                    <span className="italic font-medium"> unique, engaging narrative</span> complete with professional narration and optional atmospheric music.
                  </p>
                </div>

                <div className="bg-purple-50 p-6 rounded-xl shadow-sm max-w-3xl mx-auto">
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                    <span className="font-bold text-story-purple">🎯 Interactive Features:</span> Each story comes with 
                    <span className="font-medium"> highlighted text synchronization</span>, 
                    <span className="text-story-blue font-medium">comprehension-boosting activities</span>, and 
                    <span className="text-story-orange font-medium">educational elements</span> that make learning fun!
                  </p>
                </div>

                <div className="bg-orange-50 p-6 rounded-xl shadow-sm max-w-3xl mx-auto">
                  <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                    <span className="font-bold text-story-orange">🌈 After the Story:</span> Engage with our 
                    <span className="font-medium text-story-purple">AI-powered quiz</span> to check understanding, or use our 
                    <span className="font-medium text-story-blue">chat feature</span> to explore the story's themes and characters. 
                    <span className="font-medium italic">Save your favorites</span> to your personal library for endless storytelling magic!
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Language and Voice Column */}
          <div className="space-y-6 pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <div className="w-full transform hover:scale-[1.02] transition-transform duration-300">
                  <VoiceSelector
                    selectedVoice={settings.voice}
                    onVoiceSelect={(voice) => setSettings({ ...settings, voice })}
                  />
                </div>
                <div className="w-full transform hover:scale-[1.02] transition-transform duration-300">
                  <AgeGroupSelector
                    selectedAge={settings.ageGroup}
                    onAgeSelect={(age) => setSettings({ ...settings, ageGroup: age })}
                  />
                </div>
              </div>
              <div className="space-y-6">
                <div className="w-full transform hover:scale-[1.02] transition-transform duration-300">
                  <LanguageSelector
                    selectedLanguage={settings.language}
                    onLanguageSelect={(language) => setSettings({ ...settings, language })}
                  />
                </div>
              </div>
            </div>

            {/* Theme Section */}
            <div className="w-full transform hover:scale-[1.02] transition-transform duration-300">
              <ThemeSelector
                selectedTheme={settings.theme}
                onThemeSelect={(theme) => setSettings({ ...settings, theme })}
              />
            </div>

            {/* Duration Section */}
            <div className="w-full transform hover:scale-[1.02] transition-transform duration-300">
              <DurationSelector
                selectedDuration={settings.duration}
                onDurationSelect={(duration) => setSettings({ ...settings, duration })}
              />
            </div>

            {/* Music Section */}
            <div className="w-full transform hover:scale-[1.02] transition-transform duration-300">
              <MusicSelector
                selectedMusic={settings.music}
                onMusicSelect={(music) => setSettings({ ...settings, music })}
              />
            </div>

            {/* Start Button */}
            <div className="flex justify-center mt-8">
              <Button
                onClick={() => onStart(settings)}
                className="w-full sm:w-[400px] h-16 text-lg font-medium bg-gradient-to-r from-[#1a237e] via-[#1565c0] to-[#0288d1] hover:from-[#0d47a1] hover:to-[#01579b] text-white rounded-2xl shadow-xl transition-all duration-300 hover:shadow-blue-400/30 hover:shadow-2xl hover:-translate-y-1 flex items-center justify-center gap-4 border-0"
                size="lg"
              >
                Create Your Story
                <Play className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}