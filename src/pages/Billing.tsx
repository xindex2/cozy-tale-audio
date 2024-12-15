import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

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
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="container py-12">
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
    </div>
  );
}