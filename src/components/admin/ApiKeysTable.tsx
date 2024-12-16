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
import { Loader2, AlertTriangle, Pencil } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

interface ApiKey {
  id: string;
  key_name: string;
  key_value: string;
  created_at: string;
}

const REQUIRED_KEYS = ["ELEVEN_LABS_API_KEY", "GEMINI_API_KEY"];

export function ApiKeysTable() {
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const { toast } = useToast();
  const { data: apiKeys, isLoading, refetch } = useQuery({
    queryKey: ['admin-api-keys'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ApiKey[];
    },
  });

  const handleUpdateKey = async () => {
    if (!editingKey) return;

    const { error } = await supabase
      .from('api_keys')
      .update({ key_value: editingKey.key_value })
      .eq('id', editingKey.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update API key",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "API key updated successfully",
      });
      setEditingKey(null);
      refetch();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const missingKeys = REQUIRED_KEYS.filter(
    requiredKey => !apiKeys?.some(key => key.key_name === requiredKey)
  );

  return (
    <div className="space-y-4">
      {missingKeys.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Missing required API key: {missingKeys.join(", ")}
          </AlertDescription>
        </Alert>
      )}
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiKeys?.map((key) => (
              <TableRow key={key.id}>
                <TableCell>{key.key_name}</TableCell>
                <TableCell>
                  <code className="bg-gray-100 px-2 py-1 rounded">
                    {key.key_value}
                  </code>
                </TableCell>
                <TableCell>
                  {new Date(key.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setEditingKey(key)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!editingKey} onOpenChange={(open) => !open && setEditingKey(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit API Key</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Input
                value={editingKey?.key_value || ''}
                onChange={(e) => setEditingKey(prev => prev ? { ...prev, key_value: e.target.value } : null)}
                placeholder="Enter new API key value"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleUpdateKey}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
