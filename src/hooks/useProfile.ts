import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import { useToast } from "@/hooks/use-toast";

interface Profile {
  id: string;
  email?: string;
  avatar_url?: string;
  full_name?: string;
  is_admin?: boolean;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const { toast } = useToast();

  const fetchProfile = async (user: User) => {
    try {
      console.log('Fetching profile for user:', user.id);
      
      if (!user.id) {
        console.log('No user ID provided');
        return null;
      }

      // Try direct fetch first
      const { data: directProfile, error: directError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (!directError && directProfile) {
        console.log('Successfully fetched profile directly:', directProfile);
        const typedDirectProfile = directProfile as Profile;
        setProfile(typedDirectProfile);
        return typedDirectProfile;
      }

      // If direct fetch fails, try alternative approach with single row fetch
      const { data: singleProfile, error: singleError } = await supabase
        .from('profiles')
        .select()
        .filter('id', 'eq', user.id)
        .single();

      if (!singleError && singleProfile) {
        console.log('Successfully fetched profile with single:', singleProfile);
        const typedSingleProfile = singleProfile as Profile;
        setProfile(typedSingleProfile);
        return typedSingleProfile;
      }

      // If both approaches fail, try with RPC call
      const { data: rpcProfile, error: rpcError } = await supabase.rpc(
        'get_profile_by_id',
        { user_id: user.id }
      );

      if (!rpcError && rpcProfile) {
        console.log('Successfully fetched profile with RPC:', rpcProfile);
        // Ensure the RPC response matches our Profile interface
        const typedProfile: Profile = {
          id: user.id,
          email: rpcProfile.email,
          avatar_url: rpcProfile.avatar_url,
          full_name: rpcProfile.full_name,
          is_admin: rpcProfile.is_admin,
        };
        setProfile(typedProfile);
        return typedProfile;
      }

      // If all attempts fail, create a minimal profile
      const minimalProfile: Profile = {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name,
      };

      console.log('Using minimal profile:', minimalProfile);
      setProfile(minimalProfile);
      return minimalProfile;

    } catch (error) {
      console.error('Error in fetchProfile:', error);
      toast({
        title: "Profile fetch issue",
        description: "Using basic profile information",
        variant: "default",
      });
      
      // Return minimal profile on error
      const fallbackProfile: Profile = {
        id: user.id,
        email: user.email,
      };
      setProfile(fallbackProfile);
      return fallbackProfile;
    }
  };

  const clearProfile = () => {
    console.log('Clearing profile');
    setProfile(null);
  };

  return {
    profile,
    fetchProfile,
    clearProfile,
  };
};