import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, BookOpen, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { UsersTable } from "@/components/admin/UsersTable";
import { useToast } from "@/components/ui/use-toast";

export default function AdminDashboard() {
  const { toast } = useToast();

  // Check if user is authenticated
  const { data: session, isLoading: isLoadingSession, error: sessionError } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      console.log('Fetching session...');
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Session error:', error);
        throw error;
      }
      if (!session) {
        throw new Error('No session found');
      }
      console.log('Session found:', session);
      return session;
    },
  });

  // Check if user is admin
  const { data: profile, isLoading: isLoadingProfile, error: profileError } = useQuery({
    queryKey: ['admin-profile', session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      console.log('Fetching profile...');
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session!.user.id)
        .single();

      if (error) {
        console.error('Profile error:', error);
        throw error;
      }
      if (!data) {
        throw new Error('No profile found');
      }
      console.log('Profile found:', data);
      return data;
    },
  });

  // Fetch stats only if user is admin
  const { data: stats, isLoading: isLoadingStats, error: statsError } = useQuery({
    queryKey: ['admin-stats'],
    enabled: !!profile?.is_admin,
    queryFn: async () => {
      console.log('Fetching stats...');
      const [usersResponse, storiesResponse] = await Promise.all([
        supabase.from('profiles').select('count'),
        supabase.from('stories').select('count'),
      ]);

      if (usersResponse.error) {
        console.error('Users count error:', usersResponse.error);
        throw usersResponse.error;
      }
      if (storiesResponse.error) {
        console.error('Stories count error:', storiesResponse.error);
        throw storiesResponse.error;
      }

      console.log('Stats found:', {
        users: usersResponse.count,
        stories: storiesResponse.count,
      });

      return {
        users: usersResponse.count || 0,
        stories: storiesResponse.count || 0,
      };
    },
  });

  // Handle session loading state
  if (isLoadingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
        <Header />
        <main className="container py-8 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </main>
        <Footer />
      </div>
    );
  }

  // Handle authentication errors
  if (sessionError || !session) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
        <Header />
        <main className="container py-8">
          <Alert variant="destructive">
            <AlertTitle>Authentication Error</AlertTitle>
            <AlertDescription>
              Please sign in to access this page.
            </AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }

  // Handle profile loading state
  if (isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
        <Header />
        <main className="container py-8 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </main>
        <Footer />
      </div>
    );
  }

  // Handle profile errors or non-admin users
  if (profileError || !profile?.is_admin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
        <Header />
        <main className="container py-8">
          <Alert variant="destructive">
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You don't have permission to access this page.
            </AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }

  // Handle stats error
  if (statsError) {
    toast({
      variant: "destructive",
      title: "Error loading statistics",
      description: "There was a problem loading the dashboard statistics.",
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Header />
      <main className="container py-8">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="h-8 w-8 text-blue-600" />
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        </div>

        {isLoadingStats ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Total Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats?.users}</p>
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
                <p className="text-3xl font-bold">{stats?.stories}</p>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Recent Users</h2>
          <UsersTable />
        </div>
      </main>
      <Footer />
    </div>
  );
}