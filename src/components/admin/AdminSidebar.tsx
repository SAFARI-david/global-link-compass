import { Link, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Users,
  UserCheck,
  FileText,
  CreditCard,
  Briefcase,
  GraduationCap,
  Globe,
  Shield,
  Tag,
  Percent,
  Target,
  FolderOpen,
  BarChart3,
  FlaskConical,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", to: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Applicants", to: "/admin/applicants", icon: Users },
  { label: "Agents", to: "/admin/agents", icon: UserCheck },
  { label: "Applications", to: "/admin/applications", icon: FileText },
  { label: "Jobs", to: "/admin/jobs", icon: Briefcase },
  { label: "Programs", to: "/admin/programs", icon: GraduationCap },
  { label: "Payments", to: "/admin/payments", icon: CreditCard },
  { label: "Commissions", to: "/admin/commissions", icon: Percent },
  { label: "Pricing", to: "/admin/pricing", icon: Tag },
  { label: "Leads", to: "/admin/leads", icon: Target },
  { label: "Analytics", to: "/admin/analytics", icon: BarChart3 },
  { label: "A/B Tests", to: "/admin/ab-tests", icon: FlaskConical },
  { label: "Documents", to: "/admin/documents", icon: FolderOpen },
];

export function AdminSidebar() {
  const location = useLocation();

  return (
    <aside className="hidden w-64 flex-shrink-0 border-r border-border bg-card lg:flex lg:flex-col">
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-destructive">
          <Shield className="h-4 w-4 text-destructive-foreground" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-xs font-bold tracking-tight text-foreground">Global Link</span>
          <span className="text-[9px] font-medium tracking-widest text-destructive uppercase">Admin Panel</span>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.to ||
            (item.to !== "/admin/dashboard" &&
              location.pathname.startsWith(item.to) &&
              item.to.length > "/admin/".length);
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border p-3">
        <Link
          to="/"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Globe className="h-4 w-4" />
          Back to Site
        </Link>
      </div>
    </aside>
  );
}
