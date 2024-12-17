import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import CreateStory from "@/pages/CreateStory";
import Stories from "@/pages/Stories";
import StoryView from "@/pages/StoryView";
import Profile from "@/pages/Profile";
import Settings from "@/pages/Settings";
import Billing from "@/pages/Billing";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminPlans from "@/pages/admin/Plans";
import AdminApiKeys from "@/pages/admin/ApiKeys";
import Pricing from "@/pages/Pricing";
import "./App.css";

const queryClient = new QueryClient();

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    errorElement: <ErrorBoundary><div>Something went wrong</div></ErrorBoundary>,
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
    path: "/create",
    element: <CreateStory />,
  },
  {
    path: "/stories",
    element: <Stories />,
  },
  {
    path: "/story/:id",
    element: <StoryView />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/billing",
    element: <Billing />,
  },
  {
    path: "/pricing",
    element: <Pricing />,
  },
  {
    path: "/contact",
    element: <Contact />,
  },
  {
    path: "/privacy",
    element: <Privacy />,
  },
  {
    path: "/terms",
    element: <Terms />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/plans",
    element: <AdminPlans />,
  },
  {
    path: "/admin/api-keys",
    element: <AdminApiKeys />,
  },
]);

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;