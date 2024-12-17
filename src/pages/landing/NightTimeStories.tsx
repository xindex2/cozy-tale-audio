import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";
import { Moon, Stars, Heart } from "lucide-react";
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

export default function NightTimeStories() {
  const navigate = useNavigate();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-slate-50 to-zinc-50">
      <Header />
      <main className="flex-1">
        <div className="container px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-600 to-zinc-600 bg-clip-text text-transparent">
              Nighttime Stories
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600">
              Perfect bedtime stories for a peaceful night's sleep ✨
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Moon className="w-6 h-6 text-slate-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Relaxing</h3>
                <p className="text-gray-600">Stories that help wind down</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Stars className="w-6 h-6 text-zinc-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Engaging</h3>
                <p className="text-gray-600">Adventures that capture imagination</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Comforting</h3>
                <p className="text-gray-600">Gentle stories for sweet dreams</p>
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={() => setShowAuthDialog(true)}
                className="h-14 px-8 text-lg bg-gradient-to-r from-slate-600 to-zinc-600 hover:from-slate-700 hover:to-zinc-700"
              >
                Create Bedtime Story
                <Moon className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-gray-500">Start your free trial • No credit card required</p>
            </div>

            <div className="mt-16 bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Perfect for Every Night</h2>
              <div className="space-y-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600">✓</span>
                  </div>
                  <p className="text-gray-600">Stories that grow with your child</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600">✓</span>
                  </div>
                  <p className="text-gray-600">Customizable story length and themes</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600">✓</span>
                  </div>
                  <p className="text-gray-600">New stories added regularly</p>
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
            <AlertDialogTitle>Begin Your Story Journey</AlertDialogTitle>
            <AlertDialogDescription>
              Create a free account to access personalized bedtime stories that make every night special. Join our community today!
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