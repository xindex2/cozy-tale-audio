import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Story } from "@/types/story";

interface StoriesTableProps {
  stories: Story[];
  onRefresh?: () => void;
}

export function StoriesTable({ stories, onRefresh }: StoriesTableProps) {
  const navigate = useNavigate();

  const handleView = (story: Story) => {
    navigate(`/stories/${story.id}`, {
      state: { settings: story.settings }
    });
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stories.map((story) => (
            <TableRow key={story.id}>
              <TableCell>{story.title}</TableCell>
              <TableCell>
                {new Date(story.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleView(story)}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}