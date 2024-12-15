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
      if (event === "SIGNED_IN" && session?.user?.email) {
        if (!session.user.email_confirmed_at) {
          toast({
            title: "Welcome!",
            description: "Your account has been created successfully.",
          });
        }
        navigate("/dashboard");
      } else if (event === "SIGNED_OUT") {
        navigate("/");
      } else if (event === "USER_UPDATED") {
        toast({
          title: "Success",
          description: "Your profile has been updated.",
        });
      } else if (event === "PASSWORD_RECOVERY") {
        toast({
          title: "Check your email",
          description: "We've sent you a password reset link.",
        });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, toast]);

  const handleError = (error: any) => {
    console.error('Auth error:', error);
    toast({
      title: "Authentication Error",
      description: error.message || "Invalid login credentials. Please check your email and password.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 flex items-center justify-center p-4">
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
            },
            style: {
              button: {
                borderRadius: '0.375rem',
                height: '2.5rem',
              },
              input: {
                borderRadius: '0.375rem',
                height: '2.5rem',
              },
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
              sign_in: {
                email_label: 'Email',
                password_label: 'Password',
                email_input_placeholder: 'Your email address',
                password_input_placeholder: 'Your password',
                button_label: 'Sign in',
                loading_button_label: 'Signing in ...',
                social_provider_text: 'Sign in with {{provider}}',
                link_text: 'Already have an account? Sign in',
              },
            },
          }}
          view="sign_in"
          showLinks={true}
          onAuthError={handleError}
        />
      </Card>
    </div>
  );
}