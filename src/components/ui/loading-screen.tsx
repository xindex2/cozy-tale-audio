import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50">
      <Header />
      <main className="flex-1 container py-8 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}