import { Link } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GradientButton } from "@/components/ui/gradient-button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Header />
      <main className="container py-16">
        <div className="max-w-md mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">Page not found</p>
          <Link to="/">
            <GradientButton className="gap-2">
              <Home className="h-4 w-4" />
              Back to Home
            </GradientButton>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
}