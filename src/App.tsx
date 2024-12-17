import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Dashboard from "@/pages/Dashboard";
import CreateStory from "@/pages/CreateStory";
import Stories from "@/pages/Stories";
import StoryView from "@/pages/StoryView";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Billing from "@/pages/Billing";
import AdminDashboard from "@/pages/AdminDashboard";
import BedtimeStoriesForKids from "@/pages/landing/BedtimeStoriesForKids";
import ShortBedtimeStories from "@/pages/landing/ShortBedtimeStories";
import SleepStoriesForAdults from "@/pages/landing/SleepStoriesForAdults";
import FairyTalesForKids from "@/pages/landing/FairyTalesForKids";
import DreamtimeStories from "@/pages/landing/DreamtimeStories";
import NightTimeStories from "@/pages/landing/NightTimeStories";
import StoriesForToddlers from "@/pages/landing/StoriesForToddlers";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CreateStory />} />
        <Route path="/stories" element={<Stories />} />
        <Route path="/stories/:id" element={<StoryView />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/billing" element={<Billing />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/bedtime-stories-for-kids" element={<BedtimeStoriesForKids />} />
        <Route path="/short-bedtime-stories" element={<ShortBedtimeStories />} />
        <Route path="/sleep-stories-for-adults" element={<SleepStoriesForAdults />} />
        <Route path="/fairy-tales-for-kids" element={<FairyTalesForKids />} />
        <Route path="/dreamtime-stories" element={<DreamtimeStories />} />
        <Route path="/night-time-stories" element={<NightTimeStories />} />
        <Route path="/stories-for-toddlers" element={<StoriesForToddlers />} />
      </Routes>
      <Toaster />
      <Sonner />
    </BrowserRouter>
  );
}