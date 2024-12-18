import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Shield } from "lucide-react";

export function Header() {
  const { user, profile } = useAuth();

  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link to="/" className="text-xl font-bold">
            Bedtime Stories
          </Link>
          {user && (
            <nav className="flex items-center gap-4">
              <Link to="/dashboard" className="text-sm font-medium">
                Dashboard
              </Link>
              <Link to="/stories" className="text-sm font-medium">
                My Stories
              </Link>
              {profile?.is_admin && (
                <Link 
                  to="/admin" 
                  className="flex items-center gap-2 text-sm font-medium text-blue-600"
                >
                  <Shield className="h-4 w-4" />
                  Admin
                </Link>
              )}
            </nav>
          )}
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link to="/create">
                <Button>Create Story</Button>
              </Link>
              <Link to="/profile">Profile</Link>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">
                <Button>Get Started</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}