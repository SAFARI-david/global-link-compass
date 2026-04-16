import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useRef } from "react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { loading, user, roles } = useAuth();
  const hasRedirected = useRef(false);

  const isAdmin = roles.includes("admin");

  useEffect(() => {
    if (!loading && !isAdmin && !hasRedirected.current) {
      hasRedirected.current = true;
      const current = window.location.pathname;
      window.location.href = `/login?redirect=${encodeURIComponent(current)}`;
    }
  }, [loading, isAdmin]);

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

  if (!isAdmin) {
    return null;
  }

  return <Outlet />;
}
