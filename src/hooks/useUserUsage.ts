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

      const { data, error } = await supabase
        .from('user_usage')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

      if (error) throw error;
      return data as UserUsage;
    },
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