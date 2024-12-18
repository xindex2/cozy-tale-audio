import { Routes as RouterRoutes, Route } from "react-router-dom";
import { Dashboard } from "@/pages/Dashboard";
import { CreateStory } from "@/pages/CreateStory";
import { StoryView } from "@/pages/StoryView";
import { Profile } from "@/pages/Profile";
import { Settings } from "@/pages/Settings";
import { Stories } from "@/pages/Stories";
import { Index } from "@/pages/Index";
import { Auth } from "@/pages/Auth";
import { AdminDashboard } from "@/pages/AdminDashboard";
import { Billing } from "@/pages/Billing";
import { Contact } from "@/pages/Contact";
import { Privacy } from "@/pages/Privacy";
import { Terms } from "@/pages/Terms";

export function Routes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<Index />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/create" element={<CreateStory />} />
      <Route path="/story/:id" element={<StoryView />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/stories" element={<Stories />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/billing" element={<Billing />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
    </RouterRoutes>
  );
}