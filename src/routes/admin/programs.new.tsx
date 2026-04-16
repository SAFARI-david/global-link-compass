import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { ProgramForm } from "@/components/admin/ProgramForm";

export const Route = createFileRoute("/admin/programs/new")({
  head: () => ({
    meta: [{ title: "Add Program — Admin" }],
  }),
  component: NewProgramPage,
});

function NewProgramPage() {
  const navigate = useNavigate();
  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader title="Add New Program" />
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <ProgramForm onSuccess={() => navigate({ to: "/admin/programs" })} />
        </div>
      </div>
    </div>
  );
}
