import { Routes, Route } from "react-router-dom";
import Music from "./pages/admin/Music";
import ApiKeys from "./pages/admin/ApiKeys";
import Plans from "./pages/admin/Plans";
import CreateStory from "./pages/CreateStory";
import Story from "./pages/Story";
import StoryView from "./pages/StoryView";
import { AuthGuard } from "./components/auth/AuthGuard";
import { AdminGuard } from "./components/admin/AdminGuard";
import Home from "./pages/landing/Home";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Stories from "./pages/Stories";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import BedtimeStoriesForKids from "./pages/landing/BedtimeStoriesForKids";
import ShortBedtimeStories from "./pages/landing/ShortBedtimeStories";
import SleepStoriesForAdults from "./pages/landing/SleepStoriesForAdults";
import FairyTalesForKids from "./pages/landing/FairyTalesForKids";
import DreamtimeStories from "./pages/landing/DreamtimeStories";
import NightTimeStories from "./pages/landing/NightTimeStories";
import StoriesForToddlers from "./pages/landing/StoriesForToddlers";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";
import Billing from "./pages/Billing";
import Pricing from "./pages/Pricing";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
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

      {/* Legal and Info Pages */}
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/contact" element={<Contact />} />
      
      {/* Protected routes */}
      <Route path="/dashboard" element={
        <AuthGuard>
          <Dashboard />
        </AuthGuard>
      } />
      <Route path="/create" element={
        <AuthGuard>
          <CreateStory />
        </AuthGuard>
      } />
      <Route path="/stories" element={
        <AuthGuard>
          <Stories />
        </AuthGuard>
      } />
      <Route path="/story/:id" element={
        <AuthGuard>
          <Story />
        </AuthGuard>
      } />
      <Route path="/story/view" element={
        <AuthGuard>
          <StoryView />
        </AuthGuard>
      } />
      <Route path="/profile" element={
        <AuthGuard>
          <Profile />
        </AuthGuard>
      } />
      <Route path="/settings" element={
        <AuthGuard>
          <Settings />
        </AuthGuard>
      } />
      <Route path="/billing" element={
        <AuthGuard>
          <Billing />
        </AuthGuard>
      } />

      {/* Admin routes */}
      <Route path="/admin" element={
        <AuthGuard>
          <AdminGuard>
            <AdminDashboard />
          </AdminGuard>
        </AuthGuard>
      } />
      <Route path="/admin/music" element={
        <AuthGuard>
          <AdminGuard>
            <Music />
          </AdminGuard>
        </AuthGuard>
      } />
      <Route path="/admin/api-keys" element={
        <AuthGuard>
          <AdminGuard>
            <ApiKeys />
          </AdminGuard>
        </AuthGuard>
      } />
      <Route path="/admin/plans" element={
        <AuthGuard>
          <AdminGuard>
            <Plans />
          </AdminGuard>
        </AuthGuard>
      } />

      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}