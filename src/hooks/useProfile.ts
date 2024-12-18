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

  const fetchProfile = async (user: User, retryCount = 3) => {
    try {
      console.log('Fetching profile for user:', user.id);
      
      // Add a delay between retries
      const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
      
      for (let i = 0; i < retryCount; i++) {
        try {
          if (!user.id) {
            console.log('No user ID provided');
            return null;
          }

          // Add a small delay before each attempt (exponential backoff)
          await delay(Math.min(1000 * Math.pow(2, i), 5000));
          
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          if (error) {
            console.error(`Error fetching profile (attempt ${i + 1}/${retryCount}):`, error);
            toast({
              title: "Error fetching profile",
              description: "Please try refreshing the page",
              variant: "destructive",
            });
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
          if (i === retryCount - 1) {
            toast({
              title: "Error fetching profile",
              description: "Please try refreshing the page",
              variant: "destructive",
            });
            throw error;
          }
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