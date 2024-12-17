import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AuthForm } from "@/components/auth/AuthForm";
import { getPendingStorySettings } from "@/utils/authNavigation";

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [fullName, setFullName] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);

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
        navigate('/');
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
            description: "You have successfully signed in.",
          });
        } catch (error) {
          console.error("Error during sign in process:", error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "There was a problem setting up your account. Please try again.",
          });
        }
      } else if (event === 'SIGNED_OUT') {
        toast({
          title: "Signed out",
          description: "You have been signed out successfully.",
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
        <AuthForm
          isSignUp={isSignUp}
          setIsSignUp={setIsSignUp}
          fullName={fullName}
          setFullName={setFullName}
        />
      </Card>
    </div>
  );
}