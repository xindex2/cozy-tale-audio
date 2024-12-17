import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, CreditCard, Infinity, Loader2, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface SubscriptionPlan {
  id: string;
  name: string;
  description: string | null;
  price_amount: number;
  price_currency: string;
  stripe_price_id: string;
  features: string[] | null;
  is_active: boolean;
}

export default function Pricing() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: plans, isLoading } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('price_amount', { ascending: true });
      
      if (error) throw error;
      return data as SubscriptionPlan[];
    },
  });

  const handleSubscribe = async (priceId: string) => {
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session) {
        navigate('/auth?redirect=/pricing');
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { priceId },
      });

      if (error) throw error;
      if (data?.url) window.location.href = data.url;
    } catch (error) {
      console.error('Checkout error:', error);
      toast({
        title: "Error",
        description: "Failed to start checkout process. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="container max-w-7xl py-12 px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
          Choose Your Storytelling Journey
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Unlock the power of AI-driven storytelling with our flexible plans designed for every imagination.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {plans?.map((plan) => (
          <Card 
            key={plan.id} 
            className={`flex flex-col relative overflow-hidden ${
              plan.name === 'Pro' ? 'border-blue-500 shadow-blue-100 shadow-lg scale-105 md:translate-y-[-8px]' : ''
            }`}
          >
            {plan.name === 'Pro' && (
              <div className="absolute top-5 right-5">
                <Star className="h-6 w-6 text-blue-500 fill-blue-500" />
              </div>
            )}
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                {plan.name}
              </CardTitle>
              <div className="mt-4 mb-2">
                <span className="text-4xl font-bold">
                  ${(plan.price_amount / 100).toFixed(2)}
                </span>
                {plan.price_amount > 0 && (
                  <span className="text-sm font-normal text-gray-600 ml-1">/month</span>
                )}
              </div>
              <CardDescription className="text-sm">{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <ul className="space-y-3">
                {plan.features?.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="pt-6">
              <Button 
                className={`w-full gap-2 ${
                  plan.name === 'Pro' 
                    ? 'bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700' 
                    : plan.name === 'Free Trial' 
                    ? 'bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50' 
                    : ''
                }`}
                onClick={() => handleSubscribe(plan.stripe_price_id)}
                variant={plan.name === 'Free Trial' ? 'outline' : 'default'}
              >
                <CreditCard className="h-4 w-4" />
                {plan.price_amount === 0 ? 'Start Free Trial' : 'Subscribe Now'}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <p className="text-sm text-gray-500">
          All prices in USD. Cancel anytime. Need help choosing?{' '}
          <Button 
            variant="link" 
            className="text-blue-600 hover:text-blue-800 p-0 h-auto font-normal"
            onClick={() => navigate('/contact')}
          >
            Contact us
          </Button>
        </p>
      </div>
    </div>
  );
}
