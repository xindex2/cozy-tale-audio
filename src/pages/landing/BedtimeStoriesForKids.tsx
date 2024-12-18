import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function BedtimeStoriesForKids() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Bedtime Stories for Kids | Magical Stories for Sweet Dreams</title>
        <meta name="description" content="Discover enchanting bedtime stories perfect for children. Our collection of magical tales will help your little ones drift into peaceful sleep filled with wonderful dreams." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Header />
        
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-12">
            <section className="text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-blue-900">
                Magical Bedtime Stories for Kids
              </h1>
              <p className="text-xl text-gray-600">
                Help your children fall asleep with enchanting stories that spark their imagination
              </p>
              <Button 
                onClick={() => navigate("/auth")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Start Reading Now
              </Button>
            </section>

            <section className="grid md:grid-cols-2 gap-8 py-12">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-blue-800">
                  Why Choose Our Bedtime Stories?
                </h2>
                <ul className="space-y-3 text-gray-600">
                  <li>✨ Professionally crafted for peaceful sleep</li>
                  <li>🎯 Age-appropriate content</li>
                  <li>🎨 Rich storytelling that sparks imagination</li>
                  <li>🌟 New stories added regularly</li>
                  <li>🎵 Optional soothing background music</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-blue-800">
                  Benefits of Bedtime Stories
                </h2>
                <ul className="space-y-3 text-gray-600">
                  <li>💫 Develops listening skills</li>
                  <li>📚 Enhances vocabulary</li>
                  <li>❤️ Strengthens parent-child bonding</li>
                  <li>😴 Establishes healthy sleep routines</li>
                  <li>🧠 Boosts creativity and imagination</li>
                </ul>
              </div>
            </section>

            <section className="text-center space-y-6 py-12">
              <h2 className="text-3xl font-semibold text-blue-800">
                Ready to Start Your Story Adventure?
              </h2>
              <p className="text-gray-600">
                Join thousands of families who have made our stories part of their bedtime routine
              </p>
              <Button 
                onClick={() => navigate("/auth")}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Get Started Free
              </Button>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}