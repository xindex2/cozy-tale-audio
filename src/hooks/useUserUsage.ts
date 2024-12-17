import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface UserUsage {
  stories_created: number;
  stories_read: number;
  chat_messages_sent: number;
  quiz_questions_answered: number;
}

const FREE_TRIAL_LIMITS = {
  stories_created: 1,
  stories_read: 1,
  chat_messages_sent: 1,
  quiz_questions_answered: 1,
};

export function useUserUsage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: usage, isLoading } = useQuery({
    queryKey: ['user-usage'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return null;

      // First check if user has a profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', session.user.id)
        .single();

      if (!profile) {
        console.error('No profile found for user:', session.user.id);
        return null;
      }

      // Then try to get existing usage with maybeSingle() to avoid 406 errors
      const { data: usage, error: usageError } = await supabase
        .from('user_usage')
        .select('*')
        .eq('user_id', session.user.id)
        .maybeSingle();

      if (usageError) {
        console.error('Error fetching user usage:', usageError);
        throw usageError;
      }

      // If no usage record exists, create one
      if (!usage) {
        console.log('Creating new user usage record for:', session.user.id);
        
        const { data: newData, error: insertError } = await supabase
          .from('user_usage')
          .insert([
            { 
              user_id: session.user.id,
              stories_created: 0,
              stories_read: 0,
              chat_messages_sent: 0,
              quiz_questions_answered: 0
            }
          ])
          .select()
          .single();

        if (insertError) {
          console.error('Error creating user usage:', insertError);
          throw insertError;
        }

        return newData as UserUsage;
      }

      return usage as UserUsage;
    },
    retry: 1,
  });

  const updateUsage = useMutation({
    mutationFn: async (field: keyof UserUsage) => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('No session');

      const { error } = await supabase
        .from('user_usage')
        .update({ [field]: (usage?.[field] || 0) + 1 })
        .eq('user_id', session.user.id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-usage'] });
    },
  });

  const checkAndIncrementUsage = async (field: keyof UserUsage) => {
    if (!usage) return false;

    if (usage[field] >= FREE_TRIAL_LIMITS[field]) {
      toast({
        title: "Free Trial Limit Reached",
        description: "Please upgrade to continue using this feature.",
        variant: "destructive",
      });
      navigate('/pricing');
      return false;
    }

    try {
      await updateUsage.mutateAsync(field);
      return true;
    } catch (error) {
      console.error('Error updating usage:', error);
      return false;
    }
  };

  return {
    usage,
    isLoading,
    checkAndIncrementUsage,
  };
}