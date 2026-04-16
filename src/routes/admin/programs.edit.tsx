import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProgramForm } from "@/components/admin/ProgramForm";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/programs/edit")({
  head: () => ({
    meta: [{ title: "Edit Program — Admin" }],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    id: String(search.id ?? ""),
  }),
  component: EditProgramPage,
});

function EditProgramPage() {
  const { id } = Route.useSearch();
  const navigate = useNavigate();
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("programs").select("*").eq("id", id).single().then(({ data }) => {
      setProgram(data);
      setLoading(false);
    });
  }, [id]);

  if (loading) return <div className="flex min-h-screen bg-surface"><AdminSidebar /><div className="flex flex-1 flex-col"><AdminHeader title="Edit Program" /><div className="p-6 text-muted-foreground">Loading...</div></div></div>;

  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader title="Edit Program" />
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <ProgramForm program={program} onSuccess={() => navigate({ to: "/admin/programs" })} />
        </div>
      </div>
    </div>
  );
}
