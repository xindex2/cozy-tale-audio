import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useToast } from "@/hooks/use-toast";

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        navigate('/');
        toast({
          title: "Welcome to Bedtimey!",
          description: "You have successfully signed in.",
        });
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
          <h1 className="text-2xl font-bold text-center mb-2">Welcome to Bedtimey</h1>
          <p className="text-center text-gray-600">
            Sign in to your account or create a new one
          </p>
        </div>

        <SupabaseAuth
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
              button: "w-full",
              input: "w-full",
            },
          }}
          providers={[]}
          redirectTo={`${window.location.origin}/auth/callback`}
          localization={{
            variables: {
              sign_up: {
                full_name_label: 'Full Name',
                full_name_placeholder: 'Enter your full name',
              },
            },
          }}
          view="sign_up"
          additionalData={{
            full_name: true,
          }}
        />
      </Card>
    </div>
  );
}