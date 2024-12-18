import { lazy, Suspense } from 'react';
import { Routes as RouterRoutes, Route } from 'react-router-dom';
import { LoadingScreen } from '@/components/ui/loading-screen';
import { AuthGuard } from '@/components/auth/AuthGuard';

// Lazy load all pages for better performance
const Home = lazy(() => import('@/pages/landing/Home'));
const Login = lazy(() => import('@/pages/auth/Login'));
const Register = lazy(() => import('@/pages/auth/Register'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Stories = lazy(() => import('@/pages/Stories'));
const Story = lazy(() => import('@/pages/Story'));
const CreateStory = lazy(() => import('@/pages/CreateStory'));
const Chat = lazy(() => import('@/pages/Chat'));
const Quiz = lazy(() => import('@/pages/Quiz'));
const Pricing = lazy(() => import('@/pages/Pricing'));
const Settings = lazy(() => import('@/pages/Settings'));
const Billing = lazy(() => import('@/pages/Billing'));
const NotFound = lazy(() => import('@/pages/NotFound'));

// SEO Landing Pages
const BedtimeStoriesForKids = lazy(() => import('@/pages/landing/BedtimeStoriesForKids'));
const ShortBedtimeStories = lazy(() => import('@/pages/landing/ShortBedtimeStories'));
const SleepStoriesForAdults = lazy(() => import('@/pages/landing/SleepStoriesForAdults'));
const FairyTalesForKids = lazy(() => import('@/pages/landing/FairyTalesForKids'));
const DreamtimeStories = lazy(() => import('@/pages/landing/DreamtimeStories'));
const NightTimeStories = lazy(() => import('@/pages/landing/NightTimeStories'));
const StoriesForToddlers = lazy(() => import('@/pages/landing/StoriesForToddlers'));

export default function Routes() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <RouterRoutes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/pricing" element={<Pricing />} />

        {/* SEO Landing Pages */}
        <Route path="/bedtime-stories-for-kids" element={<BedtimeStoriesForKids />} />
        <Route path="/short-bedtime-stories" element={<ShortBedtimeStories />} />
        <Route path="/sleep-stories-for-adults" element={<SleepStoriesForAdults />} />
        <Route path="/fairy-tales-for-kids" element={<FairyTalesForKids />} />
        <Route path="/dreamtime-stories" element={<DreamtimeStories />} />
        <Route path="/night-time-stories" element={<NightTimeStories />} />
        <Route path="/stories-for-toddlers" element={<StoriesForToddlers />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          }
        />
        <Route
          path="/stories"
          element={
            <AuthGuard>
              <Stories />
            </AuthGuard>
          }
        />
        <Route
          path="/story/:id"
          element={
            <AuthGuard>
              <Story />
            </AuthGuard>
          }
        />
        <Route
          path="/create"
          element={
            <AuthGuard>
              <CreateStory />
            </AuthGuard>
          }
        />
        <Route
          path="/chat"
          element={
            <AuthGuard>
              <Chat />
            </AuthGuard>
          }
        />
        <Route
          path="/quiz"
          element={
            <AuthGuard>
              <Quiz />
            </AuthGuard>
          }
        />
        <Route
          path="/settings"
          element={
            <AuthGuard>
              <Settings />
            </AuthGuard>
          }
        />
        <Route
          path="/billing"
          element={
            <AuthGuard>
              <Billing />
            </AuthGuard>
          }
        />

        {/* 404 Route */}
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
    </Suspense>
  );
}