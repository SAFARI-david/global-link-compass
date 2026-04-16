import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/agents")({
  component: AgentsLayout,
});

const PUBLIC_AGENT_PATHS = ["/agents/login", "/agents/register"];

function AgentsLayout() {
  const { loading, user, roles } = useAuth();
  const location = useLocation();
  const hasRedirected = useRef(false);

  const isPublicPage = PUBLIC_AGENT_PATHS.includes(location.pathname);
  const isAgent = roles.includes("agent") || roles.includes("admin");

  useEffect(() => {
    if (!isPublicPage && !loading && !isAgent && !hasRedirected.current) {
      hasRedirected.current = true;
      window.location.href = `/agents/login?redirect=${encodeURIComponent(location.pathname)}`;
    }
  }, [loading, isAgent, isPublicPage, location.pathname]);

  // Public pages render without guard
  if (isPublicPage) {
    return <Outlet />;
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="mt-3 text-sm text-muted-foreground">Verifying access…</p>
        </div>
      </div>
    );
  }

  if (!isAgent) {
    return null;
  }

  return <Outlet />;
}
