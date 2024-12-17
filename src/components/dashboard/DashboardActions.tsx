import { Plus } from "lucide-react";
import { GradientButton } from "@/components/ui/gradient-button";

interface DashboardActionsProps {
  onCreateNew: () => void;
  onSubscribe: () => void;
  isLoading?: boolean;
}

export function DashboardActions({ onCreateNew, onSubscribe, isLoading }: DashboardActionsProps) {
  return (
    <div className="flex justify-between items-center">
      <h1 className="text-2xl font-bold">My Stories</h1>
      <div className="flex gap-4">
        <GradientButton onClick={onCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          Create New Story
        </GradientButton>
      </div>
    </div>
  );
}