import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

export function useAuthCheck() {
  const [userId, setUserId] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const { user, isLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    try {
      if (!isLoading) {
        if (user) {
          setUserId(user.id);
        } else {
          setUserId(null);
        }
      }
    } catch (err) {
      console.error("Auth check error:", err);
      setError(err instanceof Error ? err : new Error("Authentication failed"));
      toast({
        title: "Authentication error",
        description: "Please try logging in again",
        variant: "destructive",
      });
    }
  }, [user, isLoading, toast]);

  return { userId, isLoading, error };
}