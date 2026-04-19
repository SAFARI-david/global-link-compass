import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X, Globe, ChevronDown, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";

const navItems = [
  { label: "Home", to: "/" },
  { label: "About", to: "/about" },
  {
    label: "Services",
    children: [
      { label: "All Services", to: "/services" },
      { label: "Canada Work Visa", to: "/services/canada-work-visa" },
      { label: "UK Work Visa", to: "/services/uk-work-visa" },
      { label: "UK Study Visa", to: "/services/uk-study-visa" },
      { label: "Australia Work Visa", to: "/services/australia-work-visa" },
      { label: "Germany Work Visa", to: "/services/germany-work-visa" },
      { label: "UAE Work Visa", to: "/services/uae-work-visa" },
    ],
  },
  { label: "Jobs", to: "/jobs" },
  { label: "Study", to: "/study" },
  { label: "AI Advisor", to: "/advisor" },
  { label: "For Agents", to: "/agents" },
  { label: "FAQ", to: "/faq" },
  { label: "Contact", to: "/contact" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, roles, loading: authLoading, signOut } = useAuth();

  const dashboardPath = roles.includes("admin")
    ? "/admin/dashboard"
    : roles.includes("agent")
      ? "/agents/dashboard"
      : "/dashboard";

  async function handleSignOut() {
    await signOut();
    setMobileOpen(false);
    navigate({ to: "/" });
  }

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-md">
      <div className="container-narrow flex h-16 items-center justify-between md:h-18">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Globe className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="text-sm font-bold tracking-tight text-foreground">Global Link</span>
            <span className="text-[10px] font-medium tracking-widest text-muted-foreground uppercase">Migration Services</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) =>
            item.children ? (
              <div key={item.label} className="relative"
                onMouseEnter={() => setServicesOpen(true)}
                onMouseLeave={() => setServicesOpen(false)}
              >
                <button className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                {servicesOpen && (
                  <div className="absolute left-0 top-full pt-1">
                    <div className="rounded-lg border border-border bg-card p-2 shadow-lg min-w-[180px]">
                      {item.children.map((child) => (
                        <Link
                          key={child.to}
                          to={child.to}
                          className="block rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  location.pathname === item.to
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.label}
              </Link>
            )
          )}
        </nav>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 lg:flex">
          {!authLoading && (
            user ? (
              <Link to="/dashboard">
                <Button variant="outline" size="default" className="gap-1.5">
                  <User className="h-4 w-4" /> Dashboard
                </Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button variant="outline" size="default">Sign In</Button>
              </Link>
            )
          )}
          <Link to="/apply/work-visa">
            <Button variant="gold" size="default">Apply Now</Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="flex items-center justify-center rounded-md p-2 lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-border bg-background px-4 pb-6 pt-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {navItems.map((item) =>
              item.children ? (
                <div key={item.label} className="flex flex-col">
                  <span className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{item.label}</span>
                  {item.children.map((child) => (
                    <Link
                      key={child.to}
                      to={child.to}
                      className="rounded-md px-6 py-2 text-sm font-medium text-foreground"
                      onClick={() => setMobileOpen(false)}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.to}
                  to={item.to}
                  className="rounded-md px-3 py-2 text-sm font-medium text-foreground"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>
          <div className="mt-4 flex flex-col gap-2">
            {!authLoading && (
              user ? (
                <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full gap-1.5"><User className="h-4 w-4" /> Dashboard</Button>
                </Link>
              ) : (
                <Link to="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full">Sign In</Button>
                </Link>
              )
            )}
            <Link to="/apply/work-visa" onClick={() => setMobileOpen(false)}>
              <Button variant="gold" className="w-full">Apply Now</Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
