import { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getPendingStorySettings } from "@/utils/authNavigation";

export default function Register() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [fullName, setFullName] = useState("");

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
          // Verify profile creation
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error("Error checking profile:", profileError);
            throw profileError;
          }

          // Check if this is a new signup by checking if they have a subscription
          const { data: existingSubscription, error } = await supabase
            .from('user_subscriptions')
            .select('id')
            .eq('user_id', session.user.id)
            .maybeSingle();

          if (error) {
            console.error("Error checking subscription:", error);
            throw error;
          }

          if (!existingSubscription) {
            // This is likely a new user, get the free trial plan
            const { data: freePlan, error: planError } = await supabase
              .from('subscription_plans')
              .select('id')
              .eq('name', 'Free Trial')
              .single();

            if (planError) {
              console.error("Error fetching free plan:", planError);
              throw planError;
            }

            if (freePlan) {
              // Assign free trial plan to new user
              const { error: subscriptionError } = await supabase
                .from('user_subscriptions')
                .insert([{
                  user_id: session.user.id,
                  plan_id: freePlan.id,
                  status: 'active'
                }]);

              if (subscriptionError) {
                console.error("Error creating subscription:", subscriptionError);
                throw subscriptionError;
              }
            }
          }

          // Check if there was a pending story creation
          const pendingStorySettings = getPendingStorySettings();
          if (pendingStorySettings) {
            navigate('/create', { state: { settings: pendingStorySettings } });
          } else {
            navigate('/dashboard');
          }

          toast({
            title: "Welcome to Bedtimey!",
            description: "Your account has been created successfully.",
          });
        } catch (error) {
          console.error("Error during sign up process:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "There was a problem setting up your account. Please try again.",
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
          <h1 className="text-2xl font-bold text-center mb-2">Join Bedtimey</h1>
          <p className="text-center text-gray-600 mb-6">
            Create your account
          </p>
        </div>

        <div className="space-y-2 mb-6">
          <Label htmlFor="fullName">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
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
          view="sign_up"
          localization={{
            variables: {
              sign_up: {
                email_label: "Email",
                password_label: "Password",
                button_label: "Sign up",
              },
            },
          }}
          additionalData={{ full_name: fullName }}
        />

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}