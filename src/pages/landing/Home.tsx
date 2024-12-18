import { Button } from "@/components/ui/button";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Bedtimey - Create Magical Bedtime Stories</title>
        <meta name="description" content="Create personalized bedtime stories for children with AI. Make bedtime magical with customized stories that spark imagination and create lasting memories." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Header />
        
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-12">
            <section className="text-center space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-blue-900">
                Create Magical Bedtime Stories
              </h1>
              <p className="text-xl text-gray-600">
                Personalized stories that make bedtime special
              </p>
              <Button 
                onClick={() => navigate("/create")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Create Your Story
              </Button>
            </section>

            <section className="grid md:grid-cols-2 gap-8 py-12">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-blue-800">
                  Why Choose Bedtimey?
                </h2>
                <ul className="space-y-3 text-gray-600">
                  <li>✨ Personalized stories for your child</li>
                  <li>🎯 Age-appropriate content</li>
                  <li>🎨 Rich storytelling that sparks imagination</li>
                  <li>🌟 New stories every day</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-blue-800">
                  Features
                </h2>
                <ul className="space-y-3 text-gray-600">
                  <li>💫 Interactive storytelling</li>
                  <li>📚 Multiple story themes</li>
                  <li>❤️ Family-friendly content</li>
                  <li>😴 Perfect for bedtime routines</li>
                </ul>
              </div>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}