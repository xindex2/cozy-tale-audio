import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import CreateStory from "./pages/CreateStory";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Stories from "./pages/Stories";
import AdminDashboard from "./pages/AdminDashboard";
import Pricing from "./pages/Pricing";
import Billing from "./pages/Billing";
import Contact from "./pages/Contact";
import TermsOfService from "./pages/TermsOfService";
import Privacy from "./pages/Privacy";
import { Toaster } from "@/components/ui/toaster";
import "./App.css";

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-story" element={<CreateStory />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<Privacy />} />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;