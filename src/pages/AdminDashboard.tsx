import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { StatsCards } from "@/components/admin/dashboard/StatsCards";
import { AdminHeader } from "@/components/admin/dashboard/AdminHeader";

export default function AdminDashboard() {
  // Check if user is authenticated
  const { data: session, isLoading: isLoadingSession } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      console.log("Checking session...");
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Session error:", error);
        throw error;
      }
      if (!session) {
        console.log("No session found");
        throw new Error('No session found');
      }
      console.log("Session found:", session);
      return session;
    },
  });

  // Check if user is admin
  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['admin-profile', session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      console.log("Checking admin status for user:", session?.user?.id);
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session!.user.id)
        .single();

      if (error) {
        console.error("Profile error:", error);
        throw error;
      }
      if (!data) {
        console.log("No profile found");
        throw new Error('No profile found');
      }
      console.log("Profile found:", data);
      return data;
    },
  });

  // Fetch stats
  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['admin-stats'],
    enabled: !!profile?.is_admin,
    queryFn: async () => {
      console.log("Fetching admin stats...");
      const [{ count: usersCount }, { count: storiesCount }] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('stories').select('*', { count: 'exact', head: true }),
      ]);

      return {
        users: usersCount || 0,
        stories: storiesCount || 0,
      };
    },
  });

  if (isLoadingSession || isLoadingProfile) {
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
  if (!session) {
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

  // Handle profile errors or non-admin users
  if (!profile?.is_admin) {
    console.log("Access denied - User is not admin:", profile);
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
        <Header />
        <main className="container py-8">
          <Alert variant="destructive">
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You don't have permission to access this page. Please contact an administrator if you believe this is an error.
            </AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Header />
      <main className="container py-8">
        <AdminHeader />
        {isLoadingStats ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          <StatsCards 
            usersCount={stats?.users || 0}
            storiesCount={stats?.stories || 0}
            isLoading={isLoadingStats}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}