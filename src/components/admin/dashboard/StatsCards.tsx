import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

export function StatsCards() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      console.log("Fetching admin stats...");
      const [{ data: profiles }, { count: storiesCount }] = await Promise.all([
        supabase.from('profiles').select('email'),
        supabase.from('stories').select('*', { count: 'exact', head: true }),
      ]);

      const usersWithEmail = profiles?.filter(profile => profile.email).length || 0;
      console.log('Stats fetched:', { usersWithEmail, storiesCount });
      
      return {
        users: usersWithEmail,
        stories: storiesCount || 0,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 mb-8">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Total Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats?.users || 0}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Total Stories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats?.stories || 0}</p>
        </CardContent>
      </Card>
    </div>
  );
}