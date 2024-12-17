import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit2, Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { SubscriptionPlanDialog } from "./SubscriptionPlanDialog";

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

export function SubscriptionPlansTable() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [editingPlan, setEditingPlan] = useState<SubscriptionPlan | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { data: plans, isLoading } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .order('price_amount', { ascending: true });

      if (error) throw error;
      return data as SubscriptionPlan[];
    },
  });

  const togglePlanStatus = async (planId: string, currentStatus: boolean) => {
    try {
      await supabase
        .from('subscription_plans')
        .update({ is_active: !currentStatus })
        .eq('id', planId);

      queryClient.invalidateQueries({ queryKey: ['subscription-plans'] });
      toast({
        title: "Plan status updated",
        description: `The plan has been ${!currentStatus ? 'activated' : 'deactivated'}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update plan status. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Plan
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Features</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {plans?.map((plan) => (
              <TableRow key={plan.id}>
                <TableCell className="font-medium">{plan.name}</TableCell>
                <TableCell>{plan.description}</TableCell>
                <TableCell>
                  ${(plan.price_amount / 100).toFixed(2)} {plan.price_currency}
                </TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    {Array.isArray(plan.features) && plan.features?.map((feature: string, index: number) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={plan.is_active}
                    onCheckedChange={() => togglePlanStatus(plan.id, plan.is_active)}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingPlan(plan)}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <SubscriptionPlanDialog
        open={!!editingPlan}
        onOpenChange={(open) => !open && setEditingPlan(null)}
        planToEdit={editingPlan || undefined}
      />
      <SubscriptionPlanDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </>
  );
}