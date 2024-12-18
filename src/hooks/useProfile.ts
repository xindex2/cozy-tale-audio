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

  const fetchProfile = async (user: User, retryCount = 3) => {
    try {
      console.log('Fetching profile for user:', user.id);
      
      // Add a delay between retries
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
      
      for (let i = 0; i < retryCount; i++) {
        try {
          // Add a small delay before each attempt
          await delay((i + 1) * 500);
          
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          if (error) {
            console.error(`Error fetching profile (attempt ${i + 1}/${retryCount}):`, error);
            continue;
          }

          if (!profile) {
            console.log(`Profile not found (attempt ${i + 1}/${retryCount}), retrying...`);
            continue;
          }

          console.log('Successfully fetched profile:', profile);
          setProfile(profile);
          return profile;
        } catch (error) {
          console.error(`Fetch attempt ${i + 1}/${retryCount} failed:`, error);
          if (i === retryCount - 1) throw error;
        }
      }
      
      console.error('All retry attempts failed');
      setProfile(null);
      return null;
    } catch (error) {
      console.error('Error in fetchProfile:', error);
      setProfile(null);
      return null;
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