import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

export const useProfile = () => {
  const [profile, setProfile] = useState<any | null>(null);

  const fetchProfile = async (user: User) => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      setProfile(profile);
      return profile;
    } catch (error) {
      console.error('Error fetching profile:', error);
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