import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface DashboardActionsProps {
  onCreateNew: () => void;
  onSubscribe: () => void;
  isLoading: boolean;
}

export function DashboardActions({ onCreateNew, onSubscribe, isLoading }: DashboardActionsProps) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">My Stories</h1>
      <div className="flex gap-4">
        <Button onClick={onSubscribe} disabled={isLoading} className="bg-purple-600 hover:bg-purple-700">
          {isLoading ? "Loading..." : "Upgrade to Pro"}
        </Button>
        <Button onClick={onCreateNew} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Create New Story
        </Button>
      </div>
    </div>
  );
}