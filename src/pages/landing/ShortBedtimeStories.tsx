import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";
import { Clock, Book, Sparkles } from "lucide-react";

export default function ShortBedtimeStories() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50 to-amber-50">
      <Header />
      <main className="flex-1">
        <div className="container px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              Short Bedtime Stories
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600">
              Quick, engaging stories perfect for busy families ✨
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Quick</h3>
                <p className="text-gray-600">Perfect 5-minute bedtime stories</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Book className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Engaging</h3>
                <p className="text-gray-600">Captivating stories that kids love</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Magical</h3>
                <p className="text-gray-600">Stories that spark imagination</p>
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={() => navigate("/create-story")}
                className="h-14 px-8 text-lg bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700"
              >
                Create Quick Story
                <Clock className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-gray-500">Ready in minutes • No credit card required</p>
            </div>

            <div className="mt-16 bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Perfect for Busy Families</h2>
              <div className="space-y-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600">✓</span>
                  </div>
                  <p className="text-gray-600">5-minute stories perfect for bedtime routines</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600">✓</span>
                  </div>
                  <p className="text-gray-600">Quick but meaningful stories that children remember</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600">✓</span>
                  </div>
                  <p className="text-gray-600">Easy to save and replay favorite stories</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}