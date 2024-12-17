import { useNavigate } from "react-router-dom";
import { DashboardActions } from "@/components/dashboard/DashboardActions";
import { StoriesTable } from "@/components/dashboard/StoriesTable";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

export default function Dashboard() {
  const navigate = useNavigate();

  const handleCreateNew = () => {
    navigate("/create");
  };

  const handleSubscribe = () => {
    navigate("/billing");
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-blue-50">
      <Header />
      <main className="flex-1 container py-8">
        <div className="space-y-8">
          <DashboardActions 
            onCreateNew={handleCreateNew}
            onSubscribe={handleSubscribe}
          />
          <StoriesTable />
        </div>
      </main>
      <Footer />
    </div>
  );
}