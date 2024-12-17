import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [fullName, setFullName] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);

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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Check if this is a new signup by checking if they have a subscription
        const { data: existingSubscription, error } = await supabase
          .from('user_subscriptions')
          .select('id')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (!existingSubscription && !error) {
          // This is likely a new user, get the free trial plan
          const { data: freePlan } = await supabase
            .from('subscription_plans')
            .select('id')
            .eq('name', 'Free Trial')
            .single();

          if (freePlan) {
            // Assign free trial plan to new user
            await supabase
              .from('user_subscriptions')
              .insert([{
                user_id: session.user.id,
                plan_id: freePlan.id,
                status: 'active'
              }]);
          }
        }

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
          <p className="text-center text-gray-600 mb-6">
            {isSignUp ? "Create a new account" : "Sign in to your account"}
          </p>
          
          {isSignUp && (
            <div className="space-y-2 mb-6">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                placeholder="Enter your full name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
          )}
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
              button: "w-full px-4 py-2 bg-primary text-white rounded hover:bg-primary/90",
              input: "w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary",
              label: "block text-sm font-medium text-gray-700 mb-1",
            },
          }}
          providers={[]}
          redirectTo={`${window.location.origin}/auth/callback`}
          view={isSignUp ? "sign_up" : "sign_in"}
          localization={{
            variables: {
              sign_up: {
                email_label: "Email",
                password_label: "Password",
                button_label: "Sign up",
              },
              sign_in: {
                email_label: "Email",
                password_label: "Password",
                button_label: "Sign in",
              },
            },
          }}
          {...(isSignUp && { additionalData: { full_name: fullName } })}
        />

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            {isSignUp ? "Already have an account? Sign in" : "Need an account? Sign up"}
          </button>
        </div>
      </Card>
    </div>
  );
}