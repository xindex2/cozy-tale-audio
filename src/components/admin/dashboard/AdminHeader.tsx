import { Shield } from "lucide-react";

export function AdminHeader() {
  return (
    <div className="flex items-center gap-3 mb-6">
      <Shield className="h-8 w-8 text-blue-600" />
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
    </div>
  );
}