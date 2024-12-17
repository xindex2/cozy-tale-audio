import { useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { getPendingStorySettings } from "@/utils/authNavigation";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Session error:", sessionError);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "There was a problem checking your session. Please try again.",
        });
        return;
      }
      if (session) {
        navigate('/dashboard');
      }
    };
    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event);
      
      if (event === 'SIGNED_IN' && session) {
        try {
          // Check if there was a pending story creation
          const pendingStorySettings = getPendingStorySettings();
          if (pendingStorySettings) {
            navigate('/create', { state: { settings: pendingStorySettings } });
          } else {
            navigate('/dashboard');
          }

          toast({
            title: "Welcome back!",
            description: "You have successfully signed in.",
          });
        } catch (error) {
          console.error("Error during sign in process:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "There was a problem signing in. Please try again.",
          });
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  // Handle any auth errors from URL parameters
  useEffect(() => {
    const error = searchParams.get("error");
    const error_description = searchParams.get("error_description");

    if (error) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: error_description || "There was a problem with authentication.",
      });
    }
  }, [searchParams, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-center mb-2">Welcome Back to Bedtimey</h1>
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
          view="sign_in"
          localization={{
            variables: {
              sign_in: {
                email_label: "Email",
                password_label: "Password",
                button_label: "Sign in",
              },
            },
          }}
        />

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}