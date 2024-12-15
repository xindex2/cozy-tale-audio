import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/layout/Header";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
      }
    };
    
    checkAuth();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-500">
      <Header />
      <main className="container py-8">
        <h1 className="text-2xl font-bold mb-6">My Stories</h1>
        {/* Story list will be implemented in the next step */}
      </main>
    </div>
  );
}