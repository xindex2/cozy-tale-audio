import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, BookOpen, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SubscriptionPlanDialog } from "@/components/admin/SubscriptionPlanDialog";
import { SubscriptionPlansTable } from "@/components/admin/SubscriptionPlansTable";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPlanDialog, setShowPlanDialog] = useState(false);

  // Check if user is authenticated and admin
  const { data: adminCheck, isLoading: isCheckingAdmin } = useQuery({
    queryKey: ['admin-check'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const { data: profile, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single();

      if (error || !profile?.is_admin) {
        throw new Error('Not authorized');
      }

      return true;
    },
  });

  // Fetch stats only if user is admin
  const { data: stats, isLoading: isLoadingStats, error: statsError } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      try {
        const [usersResponse, storiesResponse] = await Promise.all([
          supabase.from('profiles').select('count'),
          supabase.from('stories').select('count'),
        ]);

        if (usersResponse.error) throw usersResponse.error;
        if (storiesResponse.error) throw storiesResponse.error;

        return {
          users: usersResponse.count || 0,
          stories: storiesResponse.count || 0,
        };
      } catch (error) {
        toast({
          title: "Error loading stats",
          description: "Failed to load dashboard statistics. Please try refreshing the page.",
          variant: "destructive",
        });
        throw error;
      }
    },
    enabled: !!adminCheck,
    retry: 1,
  });

  // Show loading state while checking admin status
  if (isCheckingAdmin) {
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

  // Show error if not admin
  if (!adminCheck) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
        <Header />
        <main className="container py-8">
          <Alert variant="destructive">
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
        ) : statsError ? (
          <Alert variant="destructive" className="mb-8">
            <AlertDescription>
              Failed to load dashboard statistics. Please try refreshing the page.
            </AlertDescription>
          </Alert>
        ) : (
          <>
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

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Subscription Plans</h2>
                <Button onClick={() => setShowPlanDialog(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Plan
                </Button>
              </div>
              <SubscriptionPlansTable />
            </div>
          </>
        )}
      </main>
      <Footer />
      <SubscriptionPlanDialog 
        open={showPlanDialog} 
        onOpenChange={setShowPlanDialog} 
      />
    </div>
  );
}