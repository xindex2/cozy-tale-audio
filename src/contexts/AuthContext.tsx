import { createContext, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useProfile } from "@/hooks/useProfile";
import { useAuthState } from "@/hooks/useAuthState";

interface AuthContextType {
  user: User | null;
  profile: any | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const { profile, fetchProfile, clearProfile } = useProfile();
  const {
    user,
    setUser,
    isLoading,
    setIsLoading,
    clearAuthState,
    handleSignOut,
  } = useAuthState();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user);
        } else {
          clearAuthState();
          clearProfile();
          navigate('/auth');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        clearAuthState();
        clearProfile();
        navigate('/auth');
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session);

      if (event === 'SIGNED_IN' && session) {
        try {
          setIsLoading(true);
          setUser(session.user);
          await fetchProfile(session.user);
          navigate('/dashboard');
        } catch (error) {
          console.error('Error handling sign in:', error);
          clearAuthState();
          clearProfile();
          navigate('/auth');
        } finally {
          setIsLoading(false);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('Handling SIGNED_OUT event');
        clearAuthState();
        clearProfile();
        navigate('/auth');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, setUser, setIsLoading, clearAuthState, fetchProfile, clearProfile]);

  const signOut = async () => {
    try {
      await handleSignOut();
      clearProfile();
      navigate('/auth');
    } catch (error) {
      console.error('Error in signOut:', error);
      // Force clear everything even if there's an error
      clearAuthState();
      clearProfile();
      navigate('/auth');
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