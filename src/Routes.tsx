import { Routes, Route } from "react-router-dom";
import Music from "./pages/admin/Music";
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

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
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

      {/* 404 route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}