import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Trash2 } from "lucide-react";
import type { Story } from "@/types/story";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { GradientButton } from "@/components/ui/gradient-button";

interface StoriesTableProps {
  stories: Story[];
  onRefresh?: () => void;
}

export function StoriesTable({ stories, onRefresh }: StoriesTableProps) {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleView = (story: Story) => {
    navigate(`/story/${story.id}`, { 
      state: { 
        settings: story.settings,
        initialStoryData: {
          title: story.title,
          content: story.content,
          audioUrl: story.audio_url,
          backgroundMusicUrl: story.background_music_url,
        }
      } 
    });
  };

  const handleDelete = async (story: Story) => {
    try {
      const { error } = await supabase
        .from('stories')
        .delete()
        .eq('id', story.id);

      if (error) throw error;

      toast({
        title: "Story deleted",
        description: "Your story has been successfully deleted.",
      });

      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error deleting story:', error);
      toast({
        title: "Error",
        description: "Failed to delete the story. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stories.map((story) => (
            <TableRow key={story.id}>
              <TableCell className="font-medium">{story.title}</TableCell>
              <TableCell>
                {new Date(story.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right space-x-2">
                <GradientButton
                  variant="ghost"
                  size="icon"
                  onClick={() => handleView(story)}
                >
                  <Eye className="h-4 w-4" />
                </GradientButton>
                <GradientButton
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(story)}
                  className="text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </GradientButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}