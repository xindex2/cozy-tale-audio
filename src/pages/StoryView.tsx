import { useLocation, useNavigate } from "react-router-dom";
import { StoryPlayer } from "@/components/StoryPlayer";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function StoryView() {
  const location = useLocation();
  const navigate = useNavigate();
  const { settings, storyData } = location.state || {};

  if (!settings || !storyData) {
    navigate("/stories");
    return null;
  }

  const handleBack = () => {
    navigate("/stories");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50">
      <Header />
      <main className="flex-1 container py-8">
        <StoryPlayer 
          settings={settings}
          onBack={handleBack}
          initialStoryData={storyData}
        />
      </main>
      <Footer />
    </div>
  );
}