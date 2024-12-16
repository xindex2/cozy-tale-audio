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
import { Loader2, AlertTriangle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ApiKey {
  id: string;
  key_name: string;
  key_value: string;
  created_at: string;
}

const REQUIRED_KEYS = ["ELEVEN_LABS_API_KEY", "OPENAI_API_KEY"];

export function ApiKeysTable() {
  const { data: apiKeys, isLoading } = useQuery({
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
            Missing required API keys: {missingKeys.join(", ")}
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}