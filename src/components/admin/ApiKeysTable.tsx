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
import { Loader2, AlertTriangle, Pencil, Plus } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import type { ApiKey } from "./api-keys/types";
import { AddKeyDialog } from "./api-keys/AddKeyDialog";
import { EditKeyDialog } from "./api-keys/EditKeyDialog";
import { useToast } from "@/hooks/use-toast";

const REQUIRED_KEYS = ["OPENAI_API_KEY", "ELEVEN_LABS_API_KEY"];

export function ApiKeysTable() {
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);
  const [isAddingKey, setIsAddingKey] = useState(false);
  const { toast } = useToast();

  const { data: apiKeys, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-api-keys'],
    queryFn: async () => {
      console.log("Fetching API keys...");
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching API keys:", error);
        throw error;
      }
      console.log("API keys fetched:", data);
      return data as ApiKey[];
    },
  });

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load API keys. Please try again.
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const missingKeys = REQUIRED_KEYS.filter(
    requiredKey => !apiKeys?.some(key => key.key_name === requiredKey && key.is_active)
  );

  const hasOpenAIKey = apiKeys?.some(key => 
    key.key_name === "OPENAI_API_KEY" && key.is_active
  );

  if (!hasOpenAIKey) {
    toast({
      title: "OpenAI API Key Required",
      description: "Please add your OpenAI API key to enable AI features.",
      variant: "destructive",
    });
  }

  return (
    <div className="space-y-4">
      {missingKeys.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Missing required API keys: {missingKeys.join(", ")}. These keys are required for story generation to work.
          </AlertDescription>
        </Alert>
      )}
      
      <div className="flex justify-end mb-4">
        <Button onClick={() => setIsAddingKey(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Add API Key
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Status</TableHead>
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
                    {key.key_value.substring(0, 8)}...
                  </code>
                </TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded text-sm ${key.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {key.is_active ? 'Active' : 'Inactive'}
                  </span>
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

      <AddKeyDialog
        isOpen={isAddingKey}
        onClose={() => setIsAddingKey(false)}
        onSuccess={refetch}
        requiredKeys={REQUIRED_KEYS}
      />

      <EditKeyDialog
        editingKey={editingKey}
        onClose={() => setEditingKey(null)}
        onSuccess={refetch}
      />
    </div>
  );
}