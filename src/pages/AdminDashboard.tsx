import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, BookOpen, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SubscriptionPlanDialog } from "@/components/admin/SubscriptionPlanDialog";
import { SubscriptionPlansTable } from "@/components/admin/SubscriptionPlansTable";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UsersTable } from "@/components/admin/UsersTable";
import { ApiKeysTable } from "@/components/admin/ApiKeysTable";
import { useToast } from "@/hooks/use-toast";

export default function AdminDashboard() {
  const [showPlanDialog, setShowPlanDialog] = useState(false);
  const { toast } = useToast();

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

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
            <TabsTrigger value="plans">Subscription Plans</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UsersTable />
          </TabsContent>

          <TabsContent value="api-keys">
            <ApiKeysTable />
          </TabsContent>

          <TabsContent value="plans" className="space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Subscription Plans</h2>
              <Button onClick={() => setShowPlanDialog(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add Plan
              </Button>
            </div>
            <SubscriptionPlansTable />
          </TabsContent>
        </Tabs>
      </main>
      <Footer />
      <SubscriptionPlanDialog 
        open={showPlanDialog} 
        onOpenChange={setShowPlanDialog} 
      />
    </div>
  );
}