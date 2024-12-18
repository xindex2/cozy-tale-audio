import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface UpgradePromptProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
}

export function UpgradePrompt({
  open,
  onOpenChange,
  title = "Upgrade Your Account",
  description = "Unlock unlimited stories, quizzes, and chat features with our premium plans.",
}: UpgradePromptProps) {
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);

  // Add debounce to prevent flashing
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    
    if (open) {
      timeoutId = setTimeout(() => {
        setShowDialog(true);
      }, 500); // Wait 500ms before showing the dialog
    } else {
      setShowDialog(false);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [open]);

  return (
    <Dialog open={showDialog} onOpenChange={(value) => {
      setShowDialog(value);
      onOpenChange(value);
    }}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="mt-6 space-y-4">
          <Button
            className="w-full"
            onClick={() => {
              setShowDialog(false);
              onOpenChange(false);
              navigate('/pricing');
            }}
          >
            View Plans
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setShowDialog(false);
              onOpenChange(false);
            }}
          >
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}