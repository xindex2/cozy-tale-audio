import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useProfile } from '@/hooks/useProfile';

interface Profile {
  id: string;
  email?: string;
  avatar_url?: string;
  full_name?: string;
  is_admin?: boolean;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  profile: null, 
  isLoading: true,
  signOut: async () => { throw new Error('AuthContext not initialized') }
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { profile, fetchProfile, clearProfile } = useProfile();

  const signOut = async () => {
    try {
      setIsLoading(true);
      console.log('Starting signOut process...');
      
      // First clear local state
      clearProfile();
      setUser(null);
      
      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log('SignOut successful');
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account",
      });
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Please try again",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    console.log('Setting up auth listener...');
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (!mounted) return;
      
      if (error) {
        console.error('Error getting session:', error);
        toast({
          title: 'Error',
          description: 'Failed to get authentication session',
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }
      
      if (session?.user) {
        console.log('Initial session found:', session.user.id);
        setUser(session.user);
        fetchProfile(session.user);
      } else {
        console.log('No initial session found');
        setUser(null);
        clearProfile();
      }
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      console.log('Auth state changed:', event, session?.user?.id);
      
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user);
      } else {
        setUser(null);
        clearProfile();
      }
      
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [toast, fetchProfile, clearProfile]);

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};