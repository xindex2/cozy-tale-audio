import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";
import { Moon, Stars, Cloud } from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function DreamtimeStories() {
  const navigate = useNavigate();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-violet-50 to-purple-50">
      <Header />
      <main className="flex-1">
        <div className="container px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              Dreamtime Stories
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600">
              Enchanting bedtime tales that inspire sweet dreams and peaceful sleep ✨
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-violet-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Moon className="w-6 h-6 text-violet-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Peaceful</h3>
                <p className="text-gray-600">Calming stories for bedtime</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Stars className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Dreamy</h3>
                <p className="text-gray-600">Stories that inspire imagination</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-fuchsia-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Cloud className="w-6 h-6 text-fuchsia-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Soothing</h3>
                <p className="text-gray-600">Gentle narratives for better sleep</p>
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={() => setShowAuthDialog(true)}
                className="h-14 px-8 text-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700"
              >
                Start Your Dream Journey
                <Moon className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-gray-500">Create your first story free • No credit card needed</p>
            </div>

            <div className="mt-16 bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Perfect for Bedtime</h2>
              <div className="space-y-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600">✓</span>
                  </div>
                  <p className="text-gray-600">Soothing narratives that help children fall asleep</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600">✓</span>
                  </div>
                  <p className="text-gray-600">Calming background music and sound effects</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600">✓</span>
                  </div>
                  <p className="text-gray-600">Perfect length for bedtime routines</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      <AlertDialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Start Your Dream Journey</AlertDialogTitle>
            <AlertDialogDescription>
              Create your free account to unlock a world of magical bedtime stories. Join thousands of happy families today!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowAuthDialog(false)}>Maybe Later</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setShowAuthDialog(false);
                navigate('/auth');
              }}
            >
              Create Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}