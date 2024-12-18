import { motion } from "framer-motion";

interface StoryOptionsHeaderProps {
  isLoggedIn: boolean;
}

export function StoryOptionsHeader({ isLoggedIn }: StoryOptionsHeaderProps) {
  return (
    <div className="text-center mb-6 space-y-6 pt-4 sm:pt-8 px-4 sm:px-6">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl sm:text-4xl lg:text-6xl font-bold bg-gradient-to-r from-[#1a237e] via-[#1565c0] to-[#0288d1] bg-clip-text text-transparent"
      >
        Bedtime Stories AI
      </motion.h1>
      {!isLoggedIn && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4 sm:space-y-6"
        >
          <p className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-story-purple to-story-blue bg-clip-text text-transparent">
            Welcome to the Future of Bedtime Stories! ✨
          </p>
          
          <div className="space-y-4">
            <p className="text-base sm:text-lg text-gray-800 max-w-3xl mx-auto leading-relaxed px-4">
              Transform bedtime into a <span className="font-bold text-story-purple">magical adventure</span> with our{' '}
              <span className="bg-gradient-to-r from-story-purple to-story-blue bg-clip-text text-transparent font-bold">AI-powered storytelling</span>{' '}
              that adapts perfectly to your child's world!
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
}