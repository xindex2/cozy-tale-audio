import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function Contact() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50">
      <Header />
      <main className="flex-1 container py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-gray-600 text-lg">
            For any inquiries, please email us at:{" "}
            <a href="mailto:support@bedtimey.com" className="text-blue-600 hover:underline">
              support@bedtimey.com
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}