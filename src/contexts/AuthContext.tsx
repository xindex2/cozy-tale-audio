import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const clearAuthState = () => {
    setUser(null);
    setProfile(null);
    queryClient.clear();
  };

  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Current session:', session);
      
      if (session?.user) {
        setUser(session.user);
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setProfile(profile);
      } else {
        clearAuthState();
      }
    } catch (error) {
      console.error('Error checking session:', error);
      clearAuthState();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);
      
      if (event === 'SIGNED_IN' && session) {
        setIsLoading(true);
        console.log('Setting user and profile for SIGNED_IN');
        setUser(session.user);
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        setProfile(profile);
        
        await queryClient.invalidateQueries({ queryKey: ['session'] });
        await queryClient.invalidateQueries({ queryKey: ['profile'] });
        
        setIsLoading(false);
        navigate('/dashboard');
      } else if (event === 'SIGNED_OUT') {
        console.log('Handling SIGNED_OUT event');
        clearAuthState();
        setIsLoading(false);
        navigate('/auth');
      }
    });

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, [navigate, queryClient]);

  const signOut = async () => {
    if (isSigningOut) {
      console.log('Already signing out, returning');
      return;
    }
    
    setIsSigningOut(true);
    try {
      console.log('Calling supabase.auth.signOut()');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      clearAuthState();
      navigate('/auth');
      
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    } finally {
      setIsSigningOut(false);
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}