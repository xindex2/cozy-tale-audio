import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { EditUserDialog } from "./EditUserDialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface User {
  id: string;
  email: string | null;
  is_admin: boolean | null;
  created_at: string;
}

interface UserSubscription {
  plan_id: string;
  status: string;
  subscription_plans: {
    name: string;
  };
}

export function UsersTable() {
  const { toast } = useToast();
  
  const { data: users, isLoading: isLoadingUsers, error } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      console.log('Fetching users...');
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
          id,
          email,
          is_admin,
          created_at,
          user_subscriptions (
            plan_id,
            status,
            subscription_plans (
              name
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
      
      console.log('Fetched profiles:', profiles);
      return profiles;
    },
    retry: 2,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60, // 1 minute
  });

  const { data: plans } = useQuery({
    queryKey: ['subscription-plans'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('id, name')
        .eq('is_active', true);

      if (error) throw error;
      return data;
    },
  });

  if (error) {
    toast({
      variant: "destructive",
      title: "Error loading users",
      description: "There was a problem loading the users list. Please try again.",
    });
  }

  if (isLoadingUsers) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!users?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No users found
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Admin</TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user) => {
            const subscription = user.user_subscriptions?.[0] as UserSubscription | undefined;
            const planName = subscription?.subscription_plans?.name || 'Free';
            
            return (
              <TableRow key={user.id}>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.is_admin ? "Yes" : "No"}</TableCell>
                <TableCell>
                  <Badge variant={planName === 'Free' ? 'secondary' : 'default'}>
                    {planName}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(user.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <EditUserDialog 
                    user={user} 
                    subscription={subscription}
                    plans={plans || []}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}