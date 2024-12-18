import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

interface Profile {
  id: string;
  email?: string;
  avatar_url?: string;
  full_name?: string;
  is_admin?: boolean;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);

  const fetchProfile = async (user: User) => {
    try {
      console.log('Fetching profile for user:', user.id);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        setProfile(null);
        return null;
      }

      console.log('Fetched profile:', profile);
      setProfile(profile);
      return profile;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      setProfile(null);
      return null;
    }
  };

  const clearProfile = () => {
    setProfile(null);
  };

  return {
    profile,
    fetchProfile,
    clearProfile,
  };
};