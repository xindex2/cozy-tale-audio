import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { StoriesTable } from "@/components/dashboard/StoriesTable";
import { GradientButton } from "@/components/ui/gradient-button";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { useAuth } from "@/contexts/AuthContext";

export default function Stories() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: stories, isLoading: isStoriesLoading, error, refetch } = useQuery({
    queryKey: ['stories', user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      console.log('Fetching stories for user:', user?.id);
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching stories:', error);
        throw error;
      }
      return data;
    },
  });

  if (isStoriesLoading) {
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
          <GradientButton onClick={() => navigate("/create", { replace: true })} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Story
          </GradientButton>
        </div>

        {stories && stories.length > 0 ? (
          <StoriesTable stories={stories} onRefresh={refetch} />
        ) : (
          <div className="text-center py-12 space-y-4">
            <p className="text-gray-600">No stories yet. Create your first story!</p>
            <GradientButton onClick={() => navigate("/create", { replace: true })} className="gap-2">
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