import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminApiKeys from "@/pages/admin/ApiKeys";
import AdminPlans from "@/pages/admin/Plans";
import Auth from "@/pages/Auth";
import CreateStory from "@/pages/CreateStory";
import Stories from "@/pages/Stories";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";

const queryClient = new QueryClient();

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
    path: "/create-story",
    element: <CreateStory />,
  },
  {
    path: "/stories",
    element: <Stories />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
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
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;