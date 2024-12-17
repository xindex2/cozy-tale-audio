import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { getPendingStorySettings } from "@/utils/authNavigation";

export function RegisterForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthChange = async (event: any, session: any) => {
    if (event === 'SIGNED_IN' && session) {
      setIsLoading(true);
      try {
        // Check if profile exists
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          throw profileError;
        }

        // Check existing subscription
        const { data: existingSubscription, error } = await supabase
          .from('user_subscriptions')
          .select('id')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (error) {
          throw error;
        }

        if (!existingSubscription) {
          // Get free trial plan
          const { data: freePlan, error: planError } = await supabase
            .from('subscription_plans')
            .select('id')
            .eq('name', 'Free Trial')
            .single();

          if (planError) {
            throw planError;
          }

          if (freePlan) {
            // Assign free trial plan
            const { error: subscriptionError } = await supabase
              .from('user_subscriptions')
              .insert([{
                user_id: session.user.id,
                plan_id: freePlan.id,
                status: 'active'
              }]);

            if (subscriptionError) {
              throw subscriptionError;
            }
          }
        }

        // Check for pending story creation
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
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
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
              button_label: isLoading ? "Signing up..." : "Sign up",
            },
          },
        }}
        additionalData={{ full_name: fullName }}
      />
    </div>
  );
}