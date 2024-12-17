import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";
import { Book, Stars, Heart, Globe } from "lucide-react";
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

export default function FairyTalesForKids() {
  const navigate = useNavigate();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-pink-50 to-rose-50">
      <Header />
      <main className="flex-1">
        <div className="container px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
              Magical Fairy Tales for Children
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600">
              Create enchanting fairy tales that spark imagination and bring magic to bedtime ✨
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Book className="w-6 h-6 text-pink-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Classic Stories</h3>
                <p className="text-gray-600">Timeless fairy tales with modern twists</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Stars className="w-6 h-6 text-rose-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Magical</h3>
                <p className="text-gray-600">Enchanting stories full of wonder</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Personalized</h3>
                <p className="text-gray-600">Stories featuring your child as the hero</p>
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={() => setShowAuthDialog(true)}
                className="h-14 px-8 text-lg bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
              >
                Create Your Fairy Tale
                <Stars className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-gray-500">Free to get started • No credit card required</p>
            </div>

            <div className="mt-16 bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Why Parents Love Our Fairy Tales</h2>
              <div className="space-y-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600">✓</span>
                  </div>
                  <p className="text-gray-600">Personalized stories that make your child the hero</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600">✓</span>
                  </div>
                  <p className="text-gray-600">Beautiful illustrations and engaging narratives</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600">✓</span>
                  </div>
                  <p className="text-gray-600">Educational values woven into every story</p>
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
            <AlertDialogTitle>Create Your Free Account</AlertDialogTitle>
            <AlertDialogDescription>
              Join thousands of parents creating magical bedtime stories for their children. Sign up now to start your journey!
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