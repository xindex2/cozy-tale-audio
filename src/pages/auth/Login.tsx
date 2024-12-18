import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useAuth } from "@/contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    console.log('Login page - Auth state:', { user, isLoading });
    
    if (!isLoading && user) {
      console.log('User is authenticated, redirecting to dashboard');
      const from = location.state?.from || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, isLoading, navigate, location]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-center mb-2">Welcome Back</h1>
          <p className="text-center text-gray-600 mb-6">
            Sign in to your account
          </p>
        </div>

        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: "#2563eb",
                  brandAccent: "#1d4ed8",
                },
              },
            },
            className: {
              container: "space-y-4",
              button: "w-full px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white rounded transition-all duration-200",
              input: "w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary",
              label: "block text-sm font-medium text-gray-700 mb-1",
            },
          }}
          providers={[]}
          redirectTo={`${window.location.origin}/auth/callback`}
          onlyThirdPartyProviders={false}
        />
      </Card>
    </div>
  );
}