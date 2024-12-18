import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Loader2, Plus } from "lucide-react";
import { StoriesTable } from "@/components/dashboard/StoriesTable";
import { GradientButton } from "@/components/ui/gradient-button";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { useEffect } from "react";

export default function Stories() {
  const navigate = useNavigate();

  // Check authentication first
  const { data: session, isLoading: isSessionLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (!isSessionLoading && !session) {
      navigate("/auth");
    }
  }, [session, isSessionLoading, navigate]);

  const { data: stories, isLoading, error, refetch } = useQuery({
    queryKey: ['stories', session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('user_id', session!.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isSessionLoading || isLoading) {
    return <LoadingScreen />;
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Header />
      <main className="container py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Stories</h1>
          <GradientButton onClick={() => navigate("/create")} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Story
          </GradientButton>
        </div>

        {stories && stories.length > 0 ? (
          <StoriesTable stories={stories} onRefresh={refetch} />
        ) : (
          <div className="text-center py-12 space-y-4">
            <p className="text-gray-600">No stories yet. Create your first story!</p>
            <GradientButton onClick={() => navigate("/create")} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Your First Story
            </GradientButton>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}