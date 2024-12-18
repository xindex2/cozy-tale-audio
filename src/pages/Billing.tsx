import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GradientButton } from "@/components/ui/gradient-button";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

export default function Billing() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: subscription, isLoading } = useQuery({
    queryKey: ['subscription-status', user?.id],
    queryFn: async () => {
      if (!user) return null;

      const response = await fetch('/functions/v1/check-subscription', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch subscription status');
      }
      
      return response.json();
    },
    retry: 1,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const handleManageSubscription = async () => {
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        navigate('/login', { replace: true });
        return;
      }

      const response = await fetch('/functions/v1/create-portal-session', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.data.session.access_token}`,
        },
      });
      
      const { url, error } = await response.json();
      if (error) throw new Error(error);
      if (url) window.location.href = url;
      
    } catch (error) {
      console.error('Portal session error:', error);
      toast({
        title: "Error",
        description: "Failed to open billing portal. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50">
      <Header />
      <main className="flex-1 container py-12">
        <h1 className="text-3xl font-bold mb-8">Billing & Subscription</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
            <CardDescription>Manage your subscription and billing details</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <p className="font-medium">Status</p>
                  <p className="text-gray-600">
                    {subscription?.subscribed ? "Active" : "No active subscription"}
                  </p>
                  {subscription?.subscribed && subscription?.plan_name && (
                    <p className="text-gray-600">
                      Current plan: {subscription.plan_name}
                    </p>
                  )}
                </div>
                <div className="flex gap-4">
                  <GradientButton onClick={handleManageSubscription}>
                    Manage Subscription
                  </GradientButton>
                  {!subscription?.subscribed && (
                    <GradientButton 
                      variant="outline" 
                      onClick={() => navigate('/pricing', { replace: true })}
                    >
                      View Plans
                    </GradientButton>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}