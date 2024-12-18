import { createContext, useContext, useEffect, useState, useCallback } from 'react';
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

  const signOut = useCallback(async () => {
    try {
      setIsLoading(true);
      console.log('Starting signOut process...');
      
      clearProfile();
      setUser(null);
      
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      console.log('SignOut successful');
    } catch (error) {
      console.error('Error signing out:', error);
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: "Please try again",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [clearProfile, toast]);

  useEffect(() => {
    let mounted = true;
    
    const setupAuth = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (!mounted) return;
        
        if (sessionError) {
          console.error('Error getting session:', sessionError);
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
          await fetchProfile(session.user);
        } else {
          console.log('No initial session found');
          setUser(null);
          clearProfile();
        }
        
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
        });
        
        return () => {
          subscription.unsubscribe();
        };
      } catch (error) {
        console.error('Error in auth setup:', error);
        if (mounted) {
          toast({
            title: 'Error',
            description: 'Failed to initialize authentication',
            variant: 'destructive',
          });
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };
    
    setupAuth();
    
    return () => {
      mounted = false;
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