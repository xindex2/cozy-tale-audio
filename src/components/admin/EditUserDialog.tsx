import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface EditUserDialogProps {
  user: {
    id: string;
    email: string | null;
    is_admin: boolean | null;
  };
  subscription?: {
    id?: string;
    plan_id: string;
    status: string;
  } | null;
  plans: Array<{
    id: string;
    name: string;
  }>;
}

export function EditUserDialog({ user, subscription, plans }: EditUserDialogProps) {
  const [isAdmin, setIsAdmin] = useState(user.is_admin || false);
  const [selectedPlan, setSelectedPlan] = useState(subscription?.plan_id || '');
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleSave = async () => {
    try {
      console.log('Updating user:', user.id);
      console.log('Selected plan:', selectedPlan);
      
      // Update admin status
      await supabase
        .from('profiles')
        .update({ is_admin: isAdmin })
        .eq('id', user.id);

      // Handle subscription update/creation
      if (selectedPlan) {
        if (subscription?.id) {
          console.log('Updating existing subscription:', subscription.id);
          // Update existing subscription
          await supabase
            .from('user_subscriptions')
            .update({ 
              plan_id: selectedPlan,
              status: 'active',
              updated_at: new Date().toISOString()
            })
            .eq('id', subscription.id);
        } else {
          console.log('Creating new subscription for user:', user.id);
          // Create new subscription
          await supabase
            .from('user_subscriptions')
            .insert([{ 
              user_id: user.id, 
              plan_id: selectedPlan,
              status: 'active'
            }]);
        }
      }

      // Invalidate all relevant queries
      await queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      await queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      
      toast({
        title: "Success",
        description: "User updated successfully",
      });
      
      setOpen(false);
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await supabase
        .from('profiles')
        .delete()
        .eq('id', user.id);

      // Invalidate all relevant queries
      await queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      await queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      
      setOpen(false);
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Pencil className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="admin">Admin Status</Label>
            <Switch
              id="admin"
              checked={isAdmin}
              onCheckedChange={setIsAdmin}
            />
          </div>
          <div className="space-y-2">
            <Label>Subscription Plan</Label>
            <Select value={selectedPlan} onValueChange={setSelectedPlan}>
              <SelectTrigger>
                <SelectValue placeholder="Select a plan" />
              </SelectTrigger>
              <SelectContent>
                {plans.map((plan) => (
                  <SelectItem key={plan.id} value={plan.id}>
                    {plan.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-between pt-4">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete User
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the user's account and all associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}