import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface Story {
  id: string;
  title: string;
  content: string;
  created_at: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };
    
    checkAuth();
  }, [navigate]);

  const { data: stories, isLoading } = useQuery({
    queryKey: ['stories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stories')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error fetching stories",
          description: error.message,
        });
        return [];
      }

      return data as Story[];
    },
  });

  const handleDelete = async (id: string) => {
    const { error } = await supabase
      .from('stories')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Error deleting story",
        description: error.message,
      });
      return;
    }

    toast({
      title: "Story deleted",
      description: "Your story has been deleted successfully.",
    });

    queryClient.invalidateQueries({ queryKey: ['stories'] });
  };

  const handleCreateNew = () => {
    navigate("/create-story");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Header />
      <main className="container py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Stories</h1>
          <Button onClick={handleCreateNew} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Create New Story
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading stories...</div>
        ) : stories && stories.length > 0 ? (
          <div className="bg-white rounded-lg shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stories.map((story) => (
                  <TableRow key={story.id}>
                    <TableCell className="font-medium">{story.title}</TableCell>
                    <TableCell>
                      {new Date(story.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(story.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-8 bg-white rounded-lg shadow">
            <p className="text-gray-500">No stories yet. Create your first story!</p>
          </div>
        )}
      </main>
    </div>
  );
}