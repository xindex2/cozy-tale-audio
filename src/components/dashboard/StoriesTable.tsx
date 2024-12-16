import { useNavigate } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import type { Story } from "@/types/story";

interface StoriesTableProps {
  stories: Story[];
  onRefresh?: () => void;
}

export function StoriesTable({ stories, onRefresh }: StoriesTableProps) {
  const navigate = useNavigate();

  const handleView = (story: Story) => {
    navigate(`/stories/${story.id}`, { 
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
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleView(story)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}