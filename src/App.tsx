import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Stories from "@/pages/Stories";
import StoryView from "@/pages/StoryView";
import CreateStory from "@/pages/CreateStory";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminApiKeys from "@/pages/admin/ApiKeys";
import AdminPlans from "@/pages/admin/Plans";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/auth",
    element: <Auth />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/stories",
    element: <Stories />,
  },
  {
    path: "/stories/:id",
    element: <StoryView />,
  },
  {
    path: "/create-story",
    element: <CreateStory />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/api-keys",
    element: <AdminApiKeys />,
  },
  {
    path: "/admin/plans",
    element: <AdminPlans />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;