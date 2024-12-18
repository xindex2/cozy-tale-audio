import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const clearAuthState = () => {
    console.log('Clearing auth state');
    setUser(null);
    setIsLoading(false);
  };

  const handleSignOut = async () => {
    console.log('Handling sign out...');
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      clearAuthState();
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Please try again",
      });
      throw error;
    }
  };

  return {
    user,
    setUser,
    isLoading,
    setIsLoading,
    clearAuthState,
    handleSignOut,
  };
};