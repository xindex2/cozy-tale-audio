import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { StoriesTable } from "@/components/dashboard/StoriesTable";
import { DashboardActions } from "@/components/dashboard/DashboardActions";
import { Story } from "@/types/story";

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const success = searchParams.get('success');
    if (success === 'true') {
      toast({
        title: "Subscription successful!",
        description: "Thank you for subscribing to our service.",
      });
    } else if (success === 'false') {
      toast({
        variant: "destructive",
        title: "Subscription cancelled",
        description: "The subscription process was cancelled.",
      });
    }
  }, [searchParams, toast]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
    };
    
    checkAuth();
  }, [navigate]);

  const { data: stories, isLoading: storiesLoading, error } = useQuery({
    queryKey: ['stories'],
    queryFn: async () => {
      const { data: session } = await supabase.auth.getSession();
      if (!session.session) {
        throw new Error('Not authenticated');
      }

      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching stories:', error);
        throw error;
      }

      return data as Story[];
    },
    retry: 1,
    meta: {
      onError: (error: Error) => {
        toast({
          variant: "destructive",
          title: "Error fetching stories",
          description: error.message || "An error occurred while fetching stories",
        });
      }
    }
  });

  const handleCreateNew = () => {
    navigate("/create-story");
  };

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        headers: {
          Authorization: `Bearer ${session?.access_token}`,
        },
      });

      if (error) throw error;
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to start subscription process. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['stories'] });
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
        <Header />
        <main className="container py-8">
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <p className="text-red-600">Error loading stories. Please try again later.</p>
            <Button 
              onClick={() => queryClient.invalidateQueries({ queryKey: ['stories'] })}
              className="mt-4"
            >
              Retry
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Header />
      <main className="container py-8">
        <div className="flex flex-col gap-6">
          <DashboardActions
            onCreateNew={handleCreateNew}
            onSubscribe={handleSubscribe}
            isLoading={isLoading}
          />

          {storiesLoading ? (
            <div className="text-center py-8">Loading stories...</div>
          ) : stories && stories.length > 0 ? (
            <StoriesTable stories={stories} onRefresh={handleRefresh} />
          ) : (
            <div className="text-center py-8 bg-white rounded-lg shadow">
              <p className="text-gray-500">No stories yet. Create your first story!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}