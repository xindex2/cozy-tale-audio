import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { 
  BookOpen, 
  Brain, 
  Clock, 
  Heart, 
  Moon, 
  Music, 
  Sparkles, 
  Star, 
  Users,
  Wand2
} from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  const storySteps = [
    {
      icon: <Users className="w-6 h-6 text-blue-500" />,
      title: "Choose Age Group",
      description: "Select the appropriate age range for your story"
    },
    {
      icon: <Wand2 className="w-6 h-6 text-purple-500" />,
      title: "Pick a Theme",
      description: "Choose from various themes or create your own"
    },
    {
      icon: <Clock className="w-6 h-6 text-green-500" />,
      title: "Set Duration",
      description: "Select how long you want your story to be"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
              Magical Bedtime Stories
              <br />
              Created Just for You
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Experience personalized AI-powered stories that make bedtime magical for children of all ages
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-lg px-8"
              >
                <Link to={user ? "/create" : "/register"}>
                  Start Your Story
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-lg px-8"
              >
                <Link to="/stories">
                  Browse Stories
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Story Creation Steps */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-12">
            Create Your Story in 3 Simple Steps
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {storySteps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="w-12 h-12 mx-auto bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  {step.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12">
            Why Choose Our Stories?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Sparkles className="w-8 h-8 text-purple-500" />,
                title: "AI-Powered Magic",
                description: "Every story is uniquely crafted using advanced AI technology"
              },
              {
                icon: <Clock className="w-8 h-8 text-blue-500" />,
                title: "Perfect Length",
                description: "Choose from different durations to match your bedtime routine"
              },
              {
                icon: <Music className="w-8 h-8 text-pink-500" />,
                title: "Soothing Music",
                description: "Optional background music to enhance the storytelling experience"
              },
              {
                icon: <Brain className="w-8 h-8 text-green-500" />,
                title: "Educational Value",
                description: "Stories that entertain while teaching valuable life lessons"
              },
              {
                icon: <Heart className="w-8 h-8 text-red-500" />,
                title: "Age-Appropriate",
                description: "Content carefully tailored to your child's age group"
              },
              {
                icon: <Star className="w-8 h-8 text-yellow-500" />,
                title: "Interactive",
                description: "Engage with the story through quizzes and discussions"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-center mb-4">
                  {feature.icon}
                  <h3 className="text-xl font-semibold ml-3">{feature.title}</h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">
            Ready to Start Your Story Adventure?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of families creating magical bedtime moments
          </p>
          <Button
            asChild
            size="lg"
            variant="secondary"
            className="text-lg px-8"
          >
            <Link to={user ? "/create" : "/register"}>
              Create Your First Story
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}