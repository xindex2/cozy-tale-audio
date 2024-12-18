import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { AuthForm } from "@/components/auth/AuthForm";
import { getPendingStorySettings } from "@/utils/authNavigation";
import { useAuth } from "@/contexts/AuthContext";

export default function Auth() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const { user, isLoading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    if (!isLoading && user) {
      const pendingStorySettings = getPendingStorySettings();
      if (pendingStorySettings) {
        navigate('/create', { state: { settings: pendingStorySettings } });
      } else {
        navigate('/dashboard');
      }
    }
  }, [user, isLoading, navigate]);

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

  if (isLoading) {
    return null; // or a loading spinner
  }

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