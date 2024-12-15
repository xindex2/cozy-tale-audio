import { Auth as SupabaseAuth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';

export default function Auth() {
  return (
    <div className="container max-w-md mx-auto py-12">
      <SupabaseAuth 
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={['google']}
      />
    </div>
  );
}