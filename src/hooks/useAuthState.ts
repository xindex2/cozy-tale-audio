import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const clearAuthState = () => {
    setUser(null);
    queryClient.clear();
  };

  const handleSignOut = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      clearAuthState();
      navigate('/auth');
    } catch (error) {
      console.error('Sign out error:', error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Please try again",
      });
    } finally {
      setIsLoading(false);
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