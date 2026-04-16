import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  const { loading, user, hasRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || !hasRole("admin"))) {
      navigate({ to: "/login", search: { redirect: window.location.pathname } });
    }
  }, [loading, user, hasRole, navigate]);

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

  if (!user || !hasRole("admin")) {
    return null;
  }

  return <Outlet />;
}
