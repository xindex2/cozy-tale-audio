import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AddKeyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  requiredKeys: string[];
}

export function AddKeyDialog({ isOpen, onClose, onSuccess, requiredKeys }: AddKeyDialogProps) {
  const [newKey, setNewKey] = useState({ key_name: "", key_value: "" });
  const { toast } = useToast();

  const handleAddKey = async () => {
    if (!newKey.key_name || !newKey.key_value) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('api_keys')
      .insert([newKey]);

    if (error) {
      console.error("Error adding API key:", error);
      toast({
        title: "Error",
        description: "Failed to add API key",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "API key added successfully",
      });
      onSuccess();
      onClose();
      setNewKey({ key_name: "", key_value: "" });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add API Key</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Select
              value={newKey.key_name}
              onValueChange={(value) => setNewKey(prev => ({ ...prev, key_name: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select API key type" />
              </SelectTrigger>
              <SelectContent>
                {requiredKeys.map((key) => (
                  <SelectItem key={key} value={key}>
                    {key}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              value={newKey.key_value}
              onChange={(e) => setNewKey(prev => ({ ...prev, key_value: e.target.value }))}
              placeholder="Enter API key value"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAddKey}>Add Key</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}