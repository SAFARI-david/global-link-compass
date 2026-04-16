import { cn } from "@/lib/utils";

const statusConfig: Record<string, { label: string; className: string }> = {
  new: { label: "New", className: "bg-blue-100 text-blue-700" },
  under_review: { label: "Under Review", className: "bg-yellow-100 text-yellow-700" },
  pending_documents: { label: "Pending Documents", className: "bg-orange-100 text-orange-700" },
  pending_payment: { label: "Pending Payment", className: "bg-purple-100 text-purple-700" },
  in_progress: { label: "In Progress", className: "bg-cyan-100 text-cyan-700" },
  submitted: { label: "Submitted", className: "bg-indigo-100 text-indigo-700" },
  waiting_decision: { label: "Waiting Decision", className: "bg-amber-100 text-amber-700" },
  approved: { label: "Approved", className: "bg-green-100 text-green-700" },
  closed: { label: "Closed", className: "bg-gray-100 text-gray-600" },
};

export function StatusBadge({ status }: { status: string }) {
  const config = statusConfig[status] || { label: status, className: "bg-muted text-muted-foreground" };
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", config.className)}>
      {config.label}
    </span>
  );
}
