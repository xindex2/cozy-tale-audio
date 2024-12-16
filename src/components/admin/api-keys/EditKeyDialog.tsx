import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { ApiKey } from "./types";

interface EditKeyDialogProps {
  editingKey: ApiKey | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditKeyDialog({ editingKey, onClose, onSuccess }: EditKeyDialogProps) {
  const { toast } = useToast();

  const handleUpdateKey = async () => {
    if (!editingKey) return;

    const { error } = await supabase
      .from('api_keys')
      .update({ key_value: editingKey.key_value })
      .eq('id', editingKey.id);

    if (error) {
      console.error("Error updating API key:", error);
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
      onSuccess();
      onClose();
    }
  };

  return (
    <Dialog open={!!editingKey} onOpenChange={() => onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit API Key</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Input
              value={editingKey?.key_value || ''}
              onChange={(e) => editingKey && onClose()}
              placeholder="Enter new API key value"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleUpdateKey}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}