import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Loader2, Plus } from "lucide-react";
import { StoriesTable } from "@/components/dashboard/StoriesTable";
import { GradientButton } from "@/components/ui/gradient-button";

export default function Stories() {
  const navigate = useNavigate();

  const { data: stories, isLoading, error, refetch } = useQuery({
    queryKey: ['stories'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return [];
      }

      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

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
          <GradientButton onClick={() => navigate("/create-story")} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Story
          </GradientButton>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : stories && stories.length > 0 ? (
          <StoriesTable stories={stories} onRefresh={refetch} />
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">No stories yet. Create your first story!</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}