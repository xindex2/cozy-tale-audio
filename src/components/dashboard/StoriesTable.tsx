import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Play, Trash2 } from "lucide-react";
import { Story } from "@/types/story";
import { useNavigate } from "react-router-dom";

interface StoriesTableProps {
  stories: Story[];
  onDelete: (id: string) => void;
}

export function StoriesTable({ stories, onDelete }: StoriesTableProps) {
  const navigate = useNavigate();

  const handleView = (story: Story) => {
    navigate(`/stories/${story.id}`, { state: { story } });
  };

  const handlePlay = (story: Story) => {
    navigate(`/create-story`, {
      state: {
        settings: story.settings,
        existingStory: {
          title: story.title,
          content: story.content,
          audioUrl: story.audio_url,
          backgroundMusicUrl: story.background_music_url,
        },
      },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[200px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stories.map((story) => (
            <TableRow key={story.id}>
              <TableCell className="font-medium">{story.title}</TableCell>
              <TableCell>
                {new Date(story.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleView(story)}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handlePlay(story)}
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  <Play className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(story.id)}
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
  );
}