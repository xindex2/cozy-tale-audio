import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Book } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_UP') {
        toast({
          title: "Welcome!",
          description: "Your account has been created successfully.",
        });
      } else if (event === 'SIGNED_IN') {
        navigate("/dashboard");
      } else if (event === 'USER_DELETED' || event === 'SIGNED_OUT') {
        navigate("/");
      }
    });

    // Listen for auth errors
    const authListener = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'USER_UPDATED') {
        toast({
          title: "Success",
          description: "Your profile has been updated.",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
      authListener.data.subscription.unsubscribe();
    };
  }, [navigate, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-6 space-y-6">
        <div className="flex items-center justify-center gap-2 text-blue-600">
          <Book className="h-8 w-8" />
          <h1 className="text-2xl font-bold">Story Time</h1>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#2563eb',
                  brandAccent: '#1d4ed8',
                }
              }
            }
          }}
          providers={[]}
          localization={{
            variables: {
              sign_up: {
                email_label: 'Email',
                password_label: 'Password',
                email_input_placeholder: 'Your email address',
                password_input_placeholder: 'Your password',
                button_label: 'Sign up',
                loading_button_label: 'Signing up ...',
                social_provider_text: 'Sign in with {{provider}}',
                link_text: 'Don\'t have an account? Sign up',
                confirmation_text: 'Check your email for the confirmation link',
              },
            },
          }}
          onError={(error) => {
            if (error.message.includes('user_already_exists')) {
              toast({
                title: "Account exists",
                description: "An account with this email already exists. Please sign in instead.",
                variant: "destructive",
              });
            } else {
              toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
              });
            }
          }}
          view="sign_up"
          showLinks={true}
          additionalData={{
            full_name: {
              label: 'Full Name',
              placeholder: 'Enter your full name',
              type: 'text',
              required: true,
            },
          }}
        />
      </Card>
    </div>
  );
}