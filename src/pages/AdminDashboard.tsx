import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { StatsCards } from "@/components/admin/dashboard/StatsCards";
import { AdminNav } from "@/components/admin/AdminNav";
import { ApiKeysTable } from "@/components/admin/ApiKeysTable";
import { SubscriptionPlansTable } from "@/components/admin/SubscriptionPlansTable";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import { SubscriptionPlanDialog } from "@/components/admin/SubscriptionPlanDialog";

export default function AdminDashboard() {
  const [showPlanDialog, setShowPlanDialog] = useState(false);

  const { data: session, isLoading: isLoadingSession } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      if (!session) throw new Error('No session found');
      return session;
    },
  });

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['admin-profile', session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session!.user.id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('No profile found');
      return data;
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

  if (!session || !profile?.is_admin) {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Header />
      <main className="container py-8">
        <AdminNav />
        <StatsCards />
        <div className="mt-8">
          <ApiKeysTable />
        </div>
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Subscription Plans</h2>
            <Button onClick={() => setShowPlanDialog(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add Plan
            </Button>
          </div>
          <SubscriptionPlansTable />
          <SubscriptionPlanDialog 
            open={showPlanDialog} 
            onOpenChange={setShowPlanDialog} 
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}