import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminApiKeys from "@/pages/admin/ApiKeys";
import AdminPlans from "@/pages/admin/Plans";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider
        router={createBrowserRouter([
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
        ])}
      />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;