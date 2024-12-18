import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingScreen } from "@/components/ui/loading-screen";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      // Store the attempted URL for redirect after login
      navigate("/login", { 
        replace: true,
        state: { from: location.pathname }
      });
    }
  }, [user, isLoading, navigate, location]);

  // Show loading screen only on initial load
  if (isLoading) {
    return <LoadingScreen />;
  }

  return user ? <>{children}</> : null;
}