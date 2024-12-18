import { useState, useCallback } from "react";
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

  const fetchProfile = useCallback(async (user: User) => {
    try {
      if (!user.id) {
        console.log('No user ID provided');
        return null;
      }

      // Use maybeSingle() instead of single() to handle no results gracefully
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error",
          description: "Failed to load profile",
          variant: "destructive",
        });
        return null;
      }

      if (profileData) {
        console.log('Successfully fetched profile:', profileData);
        const typedProfile = profileData as Profile;
        setProfile(typedProfile);
        return typedProfile;
      }

      // If no profile found, create minimal profile
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
      
      const fallbackProfile: Profile = {
        id: user.id,
        email: user.email,
      };
      setProfile(fallbackProfile);
      return fallbackProfile;
    }
  }, [toast]);

  const clearProfile = useCallback(() => {
    console.log('Clearing profile');
    setProfile(null);
  }, []);

  return {
    profile,
    fetchProfile,
    clearProfile,
  };
};