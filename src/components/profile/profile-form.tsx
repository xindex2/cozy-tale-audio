import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GradientButton } from "@/components/ui/gradient-button";
import { Loader2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Tables } from "@/integrations/supabase/types";

type Profile = Tables<'profiles'>;

interface ProfileFormProps {
  profile: Profile;
  onProfileUpdate: (profile: Profile) => void;
}

export function ProfileForm({ profile, onProfileUpdate }: ProfileFormProps) {
  const [fullName, setFullName] = useState(profile.full_name || "");
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  const handleSaveFullName = async () => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', profile.id);

      if (error) throw error;

      onProfileUpdate({ ...profile, full_name: fullName });
      
      toast({
        title: "Success",
        description: "Full name updated successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="fullName">Full Name</Label>
        <div className="flex gap-2">
          <Input
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Enter your full name"
          />
          <GradientButton 
            onClick={handleSaveFullName}
            disabled={saving}
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save
          </GradientButton>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-500">Email</label>
        <p className="mt-1">{profile?.email}</p>
      </div>
      <div>
        <label className="text-sm font-medium text-gray-500">Role</label>
        <p className="mt-1">{profile?.is_admin ? 'Admin' : 'User'}</p>
      </div>
      <div className="pt-4 border-t">
        <GradientButton 
          variant="outline" 
          onClick={() => window.location.href = '/billing'}
          className="w-full"
        >
          Manage Subscription
        </GradientButton>
      </div>
    </div>
  );
}