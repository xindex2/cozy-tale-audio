import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function Billing() {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data: subscription, isLoading } = useQuery({
    queryKey: ['subscription-status'],
    queryFn: async () => {
      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        navigate('/auth');
        return null;
      }

      const response = await fetch('/functions/v1/check-subscription', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${session.data.session.access_token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch subscription status');
      return response.json();
    },
  });

  const handleManageSubscription = async () => {
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        navigate('/auth');
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
      toast({
        title: "Error",
        description: "Failed to open billing portal. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50">
        <Header />
        <main className="flex-1 container flex justify-center items-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </main>
        <Footer />
      </div>
    );
  }

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
            <div className="space-y-4">
              <div>
                <p className="font-medium">Status</p>
                <p className="text-gray-600">
                  {subscription?.subscribed ? "Active" : "No active subscription"}
                </p>
                {subscription?.subscribed && (
                  <p className="text-gray-600">
                    Current plan: {subscription.plan_name}
                  </p>
                )}
              </div>
              <div className="flex gap-4">
                <Button onClick={handleManageSubscription}>
                  Manage Subscription
                </Button>
                {!subscription?.subscribed && (
                  <Button variant="outline" onClick={() => navigate('/pricing')}>
                    View Plans
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
}