import { useNavigate } from "react-router-dom";
import { DashboardActions } from "@/components/dashboard/DashboardActions";
import { StoriesTable } from "@/components/dashboard/StoriesTable";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export default function Dashboard() {
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

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50">
      <Header />
      <main className="flex-1 container py-8">
        <div className="space-y-8">
          <DashboardActions 
            onCreateNew={handleCreateNew}
            onSubscribe={handleSubscribe}
          />
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
        </div>
      </main>
      <Footer />
    </div>
  );
}