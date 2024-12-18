import { Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthGuard } from "@/components/auth/AuthGuard";
import { LoadingScreen } from "@/components/ui/loading-screen";

// Lazy load components for better performance
const Dashboard = lazy(() => import("@/pages/Dashboard"));
const CreateStory = lazy(() => import("@/pages/CreateStory"));
const StoryView = lazy(() => import("@/pages/StoryView"));
const Profile = lazy(() => import("@/pages/Profile"));
const Settings = lazy(() => import("@/pages/Settings"));
const Stories = lazy(() => import("@/pages/Stories"));
const Index = lazy(() => import("@/pages/Index"));
const Login = lazy(() => import("@/pages/auth/Login"));
const Register = lazy(() => import("@/pages/auth/Register"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const Billing = lazy(() => import("@/pages/Billing"));
const Contact = lazy(() => import("@/pages/Contact"));
const Privacy = lazy(() => import("@/pages/Privacy"));
const Terms = lazy(() => import("@/pages/Terms"));

// SEO Landing Pages
const BedtimeStoriesForKids = lazy(() => import("@/pages/landing/BedtimeStoriesForKids"));
const ShortBedtimeStories = lazy(() => import("@/pages/landing/ShortBedtimeStories"));
const SleepStoriesForAdults = lazy(() => import("@/pages/landing/SleepStoriesForAdults"));
const FairyTalesForKids = lazy(() => import("@/pages/landing/FairyTalesForKids"));
const DreamtimeStories = lazy(() => import("@/pages/landing/DreamtimeStories"));
const NightTimeStories = lazy(() => import("@/pages/landing/NightTimeStories"));
const StoriesForToddlers = lazy(() => import("@/pages/landing/StoriesForToddlers"));

// Wrapper component for lazy-loaded routes
const LazyRoute = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingScreen />}>
    {children}
  </Suspense>
);

export function Routes() {
  return (
    <RouterRoutes>
      {/* Public Routes */}
      <Route path="/" element={<LazyRoute><Index /></LazyRoute>} />
      <Route path="/login" element={<LazyRoute><Login /></LazyRoute>} />
      <Route path="/register" element={<LazyRoute><Register /></LazyRoute>} />
      <Route path="/contact" element={<LazyRoute><Contact /></LazyRoute>} />
      <Route path="/privacy" element={<LazyRoute><Privacy /></LazyRoute>} />
      <Route path="/terms" element={<LazyRoute><Terms /></LazyRoute>} />
      
      {/* SEO Landing Pages */}
      <Route path="/bedtime-stories-for-kids" element={<LazyRoute><BedtimeStoriesForKids /></LazyRoute>} />
      <Route path="/short-bedtime-stories" element={<LazyRoute><ShortBedtimeStories /></LazyRoute>} />
      <Route path="/sleep-stories-for-adults" element={<LazyRoute><SleepStoriesForAdults /></LazyRoute>} />
      <Route path="/fairy-tales-for-kids" element={<LazyRoute><FairyTalesForKids /></LazyRoute>} />
      <Route path="/dreamtime-stories" element={<LazyRoute><DreamtimeStories /></LazyRoute>} />
      <Route path="/night-time-stories" element={<LazyRoute><NightTimeStories /></LazyRoute>} />
      <Route path="/stories-for-toddlers" element={<LazyRoute><StoriesForToddlers /></LazyRoute>} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <AuthGuard>
          <LazyRoute><Dashboard /></LazyRoute>
        </AuthGuard>
      } />
      <Route path="/create" element={
        <AuthGuard>
          <LazyRoute><CreateStory /></LazyRoute>
        </AuthGuard>
      } />
      <Route path="/story/:id" element={
        <AuthGuard>
          <LazyRoute><StoryView /></LazyRoute>
        </AuthGuard>
      } />
      <Route path="/profile" element={
        <AuthGuard>
          <LazyRoute><Profile /></LazyRoute>
        </AuthGuard>
      } />
      <Route path="/settings" element={
        <AuthGuard>
          <LazyRoute><Settings /></LazyRoute>
        </AuthGuard>
      } />
      <Route path="/stories" element={
        <AuthGuard>
          <LazyRoute><Stories /></LazyRoute>
        </AuthGuard>
      } />
      <Route path="/billing" element={
        <AuthGuard>
          <LazyRoute><Billing /></LazyRoute>
        </AuthGuard>
      } />
      <Route path="/admin" element={
        <AuthGuard>
          <LazyRoute><AdminDashboard /></LazyRoute>
        </AuthGuard>
      } />

      {/* Fallback for unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </RouterRoutes>
  );
}