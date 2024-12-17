import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";
import { Heart, Stars, Globe } from "lucide-react";
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

export default function StoriesForToddlers() {
  const navigate = useNavigate();
  const [showAuthDialog, setShowAuthDialog] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-emerald-50 to-teal-50">
      <Header />
      <main className="flex-1">
        <div className="container px-4 py-16 sm:px-6 lg:px-8">
          <div className="text-center space-y-8 max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
              Stories for Toddlers
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600">
              Simple, engaging stories perfect for young minds ✨
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Age-Appropriate</h3>
                <p className="text-gray-600">Stories designed for toddlers</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Stars className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Interactive</h3>
                <p className="text-gray-600">Engaging elements for learning</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Educational</h3>
                <p className="text-gray-600">Learning through storytelling</p>
              </div>
            </div>

            <div className="space-y-4">
              <Button 
                onClick={() => setShowAuthDialog(true)}
                className="h-14 px-8 text-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
              >
                Create Toddler Story
                <Stars className="ml-2 h-5 w-5" />
              </Button>
              <p className="text-sm text-gray-500">Try for free • Perfect for ages 1-3</p>
            </div>

            <div className="mt-16 bg-white p-8 rounded-xl shadow-lg">
              <h2 className="text-2xl font-bold mb-6">Perfect for Young Children</h2>
              <div className="space-y-4 text-left">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600">✓</span>
                  </div>
                  <p className="text-gray-600">Simple language perfect for toddlers</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600">✓</span>
                  </div>
                  <p className="text-gray-600">Colorful characters and engaging plots</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-green-600">✓</span>
                  </div>
                  <p className="text-gray-600">Early learning concepts integrated naturally</p>
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
            <AlertDialogTitle>Start Your Toddler's Journey</AlertDialogTitle>
            <AlertDialogDescription>
              Join thousands of parents creating perfect bedtime stories for their toddlers. Create your free account now!
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