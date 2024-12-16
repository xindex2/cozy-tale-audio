import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Shield, Loader2, Plus } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { ApiKeysTable } from "@/components/admin/ApiKeysTable";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AdminApiKeys() {
  const [showDialog, setShowDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    key_name: "",
    key_value: "",
  });

  const requiredKeys = [
    { name: "ELEVEN_LABS_API_KEY", label: "ElevenLabs API Key", description: "Required for text-to-speech functionality" },
    { name: "OPENAI_API_KEY", label: "OpenAI API Key", description: "Required for AI story generation" },
  ];

  const { data: session, isLoading: isLoadingSession } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      if (!session) throw new Error('No session found');
      return session;
    },
  });

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ['admin-profile', session?.user?.id],
    enabled: !!session?.user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session!.user.id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('No profile found');
      return data;
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('api_keys')
        .insert([formData]);

      if (error) throw error;

      toast({
        title: "API Key added successfully",
        description: `The API key "${formData.key_name}" has been added.`,
      });
      setShowDialog(false);
      setFormData({ key_name: "", key_value: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add the API key. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingSession || isLoadingProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
        <Header />
        <main className="container py-8 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </main>
        <Footer />
      </div>
    );
  }

  if (!session || !profile?.is_admin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
        <Header />
        <main className="container py-8">
          <Alert variant="destructive">
            <AlertTitle>Access Denied</AlertTitle>
            <AlertDescription>
              You don't have permission to access this page.
            </AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <Header />
      <main className="container py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold">API Keys</h1>
          </div>
          <Button onClick={() => setShowDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add API Key
          </Button>
        </div>

        <div className="mb-6">
          <Alert>
            <AlertTitle>Required API Keys</AlertTitle>
            <AlertDescription>
              The following API keys are required for the application to function properly:
              <ul className="list-disc ml-6 mt-2">
                {requiredKeys.map((key) => (
                  <li key={key.name} className="text-sm">
                    <span className="font-medium">{key.label}</span> - {key.description}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        </div>

        <ApiKeysTable />

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add API Key</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="key_name">Key Name</Label>
                <Select
                  value={formData.key_name}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, key_name: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a key type" />
                  </SelectTrigger>
                  <SelectContent>
                    {requiredKeys.map((key) => (
                      <SelectItem key={key.name} value={key.name}>
                        {key.label}
                      </SelectItem>
                    ))}
                    <SelectItem value="custom">Custom Key</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="key_value">Key Value</Label>
                <Input
                  id="key_value"
                  value={formData.key_value}
                  onChange={(e) => setFormData(prev => ({ ...prev, key_value: e.target.value }))}
                  placeholder="Enter the API key value"
                  required
                />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Key"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </main>
      <Footer />
    </div>
  );
}