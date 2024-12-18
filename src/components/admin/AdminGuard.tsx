import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface AdminGuardProps {
  children: ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user } = useAuth();

  if (!user?.is_admin) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}