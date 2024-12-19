import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useState, useEffect } from "react";

interface SubscriptionPlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  planToEdit?: {
    id: string;
    name: string;
    description: string | null;
    price_amount: number;
    stripe_price_id: string;
    features: string[] | null;
  };
}

export function SubscriptionPlanDialog({ 
  open, 
  onOpenChange,
  planToEdit 
}: SubscriptionPlanDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price_amount: 0,
    stripe_price_id: "",
    features: "",
  });

  useEffect(() => {
    if (planToEdit) {
      setFormData({
        name: planToEdit.name || "",
        description: planToEdit.description || "",
        price_amount: planToEdit.price_amount || 0,
        stripe_price_id: planToEdit.stripe_price_id || "",
        features: planToEdit.features ? planToEdit.features.join("\n") : "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        price_amount: 0,
        stripe_price_id: "",
        features: "",
      });
    }
  }, [planToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log('Submitting plan data:', formData);

    try {
      const features = formData.features
        .split("\n")
        .map(f => f.trim())
        .filter(f => f);

      const planData = {
        name: formData.name,
        description: formData.description || null,
        price_amount: formData.price_amount,
        stripe_price_id: formData.stripe_price_id,
        features,
      };

      console.log('Processed plan data:', planData);

      if (planToEdit?.id) {
        console.log('Updating plan:', planToEdit.id);
        const { error: updateError } = await supabase
          .from('subscription_plans')
          .update(planData)
          .eq('id', planToEdit.id);

        if (updateError) {
          console.error('Error updating plan:', updateError);
          throw updateError;
        }
      } else {
        console.log('Creating new plan');
        const { error: insertError } = await supabase
          .from('subscription_plans')
          .insert([planData]);

        if (insertError) {
          console.error('Error creating plan:', insertError);
          throw insertError;
        }
      }

      await queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
      
      toast({
        title: `Plan ${planToEdit ? 'updated' : 'created'} successfully`,
        description: `The subscription plan "${formData.name}" has been ${planToEdit ? 'updated' : 'created'}.`,
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving plan:', error);
      toast({
        title: "Error",
        description: "Failed to save the subscription plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {planToEdit ? "Edit Subscription Plan" : "Create Subscription Plan"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Plan Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Pro Plan"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the plan's benefits..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price">Price Amount (in cents)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price_amount}
              onChange={(e) => setFormData(prev => ({ ...prev, price_amount: Number(e.target.value) }))}
              required
              min="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stripe_price_id">Stripe Price ID</Label>
            <Input
              id="stripe_price_id"
              value={formData.stripe_price_id}
              onChange={(e) => setFormData(prev => ({ ...prev, stripe_price_id: e.target.value }))}
              placeholder="price_..."
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="features">Features (one per line)</Label>
            <Textarea
              id="features"
              value={formData.features}
              onChange={(e) => setFormData(prev => ({ ...prev, features: e.target.value }))}
              placeholder="Unlimited stories&#10;Priority support&#10;Custom themes"
              rows={5}
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : (planToEdit ? "Update Plan" : "Create Plan")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}