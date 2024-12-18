import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

export default function ShortBedtimeStories() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Short Bedtime Stories | Quick Tales for Busy Parents</title>
        <meta name="description" content="Perfect short bedtime stories for busy parents. Quick, engaging tales that help children wind down and prepare for sleep, without compromising on quality or entertainment." />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
        <Header />
        
        <main className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-12">
            <section className="text-center space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-indigo-900">
                Short Bedtime Stories
              </h1>
              <p className="text-xl text-gray-600">
                Perfect for busy evenings: complete, engaging stories in 5 minutes or less
              </p>
              <Button 
                onClick={() => navigate("/auth")}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Try Free Stories
              </Button>
            </section>

            <section className="grid md:grid-cols-2 gap-8 py-12">
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-indigo-800">
                  Perfect for Busy Families
                </h2>
                <ul className="space-y-3 text-gray-600">
                  <li>⏱️ 5-minute stories</li>
                  <li>📱 Available on all devices</li>
                  <li>🌙 Designed for bedtime</li>
                  <li>👶 Age-appropriate content</li>
                </ul>
              </div>
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-indigo-800">
                  Why Short Stories Work
                </h2>
                <ul className="space-y-3 text-gray-600">
                  <li>🎯 Maintains attention span</li>
                  <li>😴 Perfect length for bedtime</li>
                  <li>🧠 Easy to remember</li>
                  <li>❤️ Quality family time</li>
                </ul>
              </div>
            </section>

            <section className="text-center space-y-6 py-12">
              <h2 className="text-3xl font-semibold text-indigo-800">
                Start Your Story Journey Today
              </h2>
              <p className="text-gray-600">
                Join thousands of parents who make bedtime special with our short stories
              </p>
              <Button 
                onClick={() => navigate("/auth")}
                className="bg-indigo-600 hover:bg-indigo-700"
              >
                Begin Reading Now
              </Button>
            </section>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
}