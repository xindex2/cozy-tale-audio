import { Routes as RouterRoutes, Route, Navigate } from "react-router-dom";
import { AuthGuard } from "@/components/auth/AuthGuard";
import Dashboard from "@/pages/Dashboard";
import CreateStory from "@/pages/CreateStory";
import StoryView from "@/pages/StoryView";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Stories from "@/pages/Stories";
import Index from "@/pages/Index";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import AdminDashboard from "@/pages/AdminDashboard";
import Billing from "@/pages/Billing";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";

// SEO Landing Pages
import BedtimeStoriesForKids from "@/pages/landing/BedtimeStoriesForKids";
import ShortBedtimeStories from "@/pages/landing/ShortBedtimeStories";
import SleepStoriesForAdults from "@/pages/landing/SleepStoriesForAdults";
import FairyTalesForKids from "@/pages/landing/FairyTalesForKids";
import DreamtimeStories from "@/pages/landing/DreamtimeStories";
import NightTimeStories from "@/pages/landing/NightTimeStories";
import StoriesForToddlers from "@/pages/landing/StoriesForToddlers";

export function Routes() {
  return (
    <RouterRoutes>
      {/* Public Routes */}
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      
      {/* SEO Landing Pages */}
      <Route path="/bedtime-stories-for-kids" element={<BedtimeStoriesForKids />} />
      <Route path="/short-bedtime-stories" element={<ShortBedtimeStories />} />
      <Route path="/sleep-stories-for-adults" element={<SleepStoriesForAdults />} />
      <Route path="/fairy-tales-for-kids" element={<FairyTalesForKids />} />
      <Route path="/dreamtime-stories" element={<DreamtimeStories />} />
      <Route path="/night-time-stories" element={<NightTimeStories />} />
      <Route path="/stories-for-toddlers" element={<StoriesForToddlers />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
      <Route path="/create" element={<AuthGuard><CreateStory /></AuthGuard>} />
      <Route path="/story/:id" element={<AuthGuard><StoryView /></AuthGuard>} />
      <Route path="/profile" element={<AuthGuard><Profile /></AuthGuard>} />
      <Route path="/settings" element={<AuthGuard><Settings /></AuthGuard>} />
      <Route path="/stories" element={<AuthGuard><Stories /></AuthGuard>} />
      <Route path="/billing" element={<AuthGuard><Billing /></AuthGuard>} />
      <Route path="/admin" element={<AuthGuard><AdminDashboard /></AuthGuard>} />

      {/* Fallback for unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </RouterRoutes>
  );
}