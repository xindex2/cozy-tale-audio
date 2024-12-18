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
    let mounted = true;

    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user && mounted) {
          console.log('Session found, setting user:', session.user.id);
          setUser(session.user);
          await fetchProfile(session.user);
        } else {
          console.log('No session found, clearing state');
          clearAuthState();
          clearProfile();
          if (mounted) navigate('/auth');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        clearAuthState();
        clearProfile();
        if (mounted) navigate('/auth');
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);

      if (event === 'SIGNED_IN' && session && mounted) {
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
          if (mounted) setIsLoading(false);
        }
      } else if (event === 'SIGNED_OUT' && mounted) {
        console.log('Handling SIGNED_OUT event');
        clearAuthState();
        clearProfile();
        navigate('/auth');
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [navigate, setUser, setIsLoading, clearAuthState, fetchProfile, clearProfile]);

  const signOut = async () => {
    console.log('Starting sign out process...');
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