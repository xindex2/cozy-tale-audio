import { Card } from "@/components/ui/card";
import { Loader } from "lucide-react";

export function LoadingState() {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 animate-fade-in">
      <Card className="p-8 flex flex-col items-center justify-center min-h-[400px] bg-gradient-to-r from-blue-50 to-blue-100">
        <Loader className="h-8 w-8 animate-spin text-blue-500 mb-4" />
        <p className="text-blue-600">Creating your story...</p>
      </Card>
    </div>
  );
}