import { useNavigate } from "react-router-dom";
import { DashboardActions } from "@/components/dashboard/DashboardActions";
import { StoriesTable } from "@/components/dashboard/StoriesTable";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  useEffect(() => {
    if (!isSessionLoading && !session) {
      navigate("/auth");
    }
  }, [session, isSessionLoading, navigate]);

  const { data: stories, isLoading: isStoriesLoading, error, refetch } = useQuery({
    queryKey: ['stories', session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('user_id', session!.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          title: "Error loading stories",
          description: "Please try again later.",
          variant: "destructive",
        });
        throw error;
      }
      return data;
    },
    retry: 1,
  });

  const handleCreateNew = () => {
    navigate("/create");
  };

  const handleSubscribe = () => {
    navigate("/billing");
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
        <Header />
        <main className="container py-8">
          <div className="text-center text-red-600">
            Error loading stories. Please try again later.
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isSessionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
        <Header />
        <main className="container py-8">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50">
      <Header />
      <main className="flex-1 container py-8">
        <div className="space-y-8">
          <DashboardActions 
            onCreateNew={handleCreateNew}
            onSubscribe={handleSubscribe}
          />
          {isStoriesLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              <span className="ml-2 text-gray-600">Loading your stories...</span>
            </div>
          ) : stories && stories.length > 0 ? (
            <StoriesTable stories={stories} onRefresh={refetch} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No stories yet. Create your first story!</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}