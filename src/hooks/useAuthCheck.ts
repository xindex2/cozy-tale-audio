import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useAuthCheck() {
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("Checking authentication status...");
        setIsLoading(true);
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }

        if (!session) {
          console.log("No active session found");
          setUserId(null);
          return;
        }

        console.log("Active session found for user:", session.user.id);
        setUserId(session.user.id);
      } catch (err) {
        console.error("Auth check error:", err);
        setError(err instanceof Error ? err : new Error("Authentication failed"));
        toast({
          title: "Authentication error",
          description: "Please try logging in again",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event);
      if (session) {
        setUserId(session.user.id);
      } else {
        setUserId(null);
      }
      setIsLoading(false);
    });

    checkAuth();

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  return { userId, isLoading, error };
}