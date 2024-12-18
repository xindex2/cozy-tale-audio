import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Key, CreditCard } from "lucide-react";

export function AdminNav() {
  const location = useLocation();

  const links = [
    {
      href: "/admin",
      label: "Dashboard",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/api-keys",
      label: "API Keys",
      icon: Key,
    },
    {
      href: "/admin/plans",
      label: "Plans",
      icon: CreditCard,
    },
  ];

  return (
    <nav className="flex gap-4 border-b mb-6">
      {links.map((link) => {
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            to={link.href}
            className={cn(
              "flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors hover:text-primary",
              location.pathname === link.href
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}