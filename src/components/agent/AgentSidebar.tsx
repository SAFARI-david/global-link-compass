import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  MessageSquare,
  Settings,
  LogOut,
  Globe,
  Plus,
  GraduationCap,
  Briefcase,
  Percent,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", to: "/agents/dashboard", icon: LayoutDashboard },
  { label: "My Clients", to: "/agents/clients", icon: Users },
  { label: "New Client", to: "/agents/clients/new", icon: Plus },
  { label: "Work Visa Apps", to: "/agents/applications/work-visa", icon: Briefcase },
  { label: "Study Visa Apps", to: "/agents/applications/study-visa", icon: GraduationCap },
  { label: "All Applications", to: "/agents/applications", icon: FileText },
  { label: "Payments", to: "/agents/payments", icon: CreditCard },
  { label: "My Earnings", to: "/agents/commissions", icon: Percent },
  { label: "Messages", to: "/agents/messages", icon: MessageSquare },
  { label: "Settings", to: "/agents/settings", icon: Settings },
];

export function AgentSidebar() {
  const location = useLocation();

  return (
    <aside className="hidden w-64 flex-shrink-0 border-r border-border bg-card lg:flex lg:flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-border px-5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
          <Globe className="h-4 w-4 text-primary-foreground" />
        </div>
        <div className="flex flex-col leading-none">
          <span className="text-xs font-bold tracking-tight text-foreground">Global Link</span>
          <span className="text-[9px] font-medium tracking-widest text-gold uppercase">Agent Portal</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to || 
            (item.to !== "/agents/dashboard" && location.pathname.startsWith(item.to) && item.to.length > "/agents/".length);
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

      {/* Footer */}
      <div className="border-t border-border p-3">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
