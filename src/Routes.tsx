import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Music from "./pages/admin/Music";
import CreateStory from "./pages/CreateStory";
import Story from "./pages/Story";
import StoryView from "./pages/StoryView";
import { AuthGuard } from "@/components/AuthGuard";
import { AdminGuard } from "@/components/admin/AdminGuard";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateStory />} />
        <Route path="/story/:id" element={<Story />} />
        <Route path="/story/view" element={<StoryView />} />
        <Route path="/admin/music" element={
          <AuthGuard>
            <AdminGuard>
              <Music />
            </AdminGuard>
          </AuthGuard>
        } />
      </Routes>
    </Router>
  );
}
