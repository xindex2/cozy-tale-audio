import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Auth as SupabaseAuth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";

interface AuthFormProps {
  isSignUp: boolean;
  setIsSignUp: (value: boolean) => void;
  fullName: string;
  setFullName: (value: string) => void;
}

export function AuthForm({ isSignUp, setIsSignUp, fullName, setFullName }: AuthFormProps) {
  return (
    <>
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
              required
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
            button: "w-full px-4 py-2 bg-gradient-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white rounded transition-all duration-200",
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
    </>
  );
}