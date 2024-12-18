import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { AdminNav } from "@/components/admin/AdminNav";
import { MusicLibraryTable } from "@/components/admin/MusicLibraryTable";

export default function Music() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Music Library</h2>
      </div>
      <div className="space-y-4">
        <AdminNav />
        <Card className="p-6">
          <MusicLibraryTable />
        </Card>
      </div>
    </div>
  );
}