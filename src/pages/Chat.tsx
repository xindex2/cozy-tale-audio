import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function Chat() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Header />
      <main className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Chat</h1>
        <div className="text-center py-12">
          <p className="text-gray-600">Chat feature coming soon!</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}