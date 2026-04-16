import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, Eye, MoreHorizontal, FileText, Clock, CheckCircle, XCircle } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/applications")({
  head: () => ({
    meta: [
      { title: "Manage Applications — Admin" },
      { name: "description", content: "View and manage all visa and study applications." },
    ],
  }),
  component: AdminApplicationsPage,
});

type Application = {
  id: string;
  reference_number: string;
  application_type: string;
  status: string;
  payment_status: string;
  destination_country: string | null;
  form_data: Record<string, any>;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
  user_id: string | null;
};

const STATUS_COLORS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  submitted: "secondary",
  under_review: "outline",
  in_progress: "default",
  pending_documents: "outline",
  approved: "default",
  rejected: "destructive",
};

const STATUS_LABELS: Record<string, string> = {
  submitted: "Submitted",
  under_review: "Under Review",
  in_progress: "In Progress",
  pending_documents: "Pending Docs",
  approved: "Approved",
  rejected: "Rejected",
};

function AdminApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [notes, setNotes] = useState("");

  const fetchApplications = async () => {
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Failed to load applications");
      return;
    }
    setApplications((data as any) || []);
    setLoading(false);
  };

  useEffect(() => { fetchApplications(); }, []);

  const filtered = applications.filter((a) => {
    const fd = a.form_data || {};
    const applicantName = fd.fullName || fd.full_name || "";
    const matchesSearch = !search ||
      applicantName.toLowerCase().includes(search.toLowerCase()) ||
      a.reference_number.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || a.application_type === typeFilter;
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const stats = {
    total: applications.length,
    submitted: applications.filter((a) => a.status === "submitted").length,
    inProgress: applications.filter((a) => ["under_review", "in_progress"].includes(a.status)).length,
    approved: applications.filter((a) => a.status === "approved").length,
    unpaid: applications.filter((a) => a.payment_status === "unpaid" || a.payment_status === "pending").length,
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("applications").update({ status } as any).eq("id", id);
    if (error) { toast.error("Failed to update status"); return; }
    toast.success(`Status updated to ${STATUS_LABELS[status]}`);
    fetchApplications();
    if (selectedApp?.id === id) setSelectedApp({ ...selectedApp, status });
  };

  const saveNotes = async (id: string) => {
    const { error } = await supabase.from("applications").update({ admin_notes: notes } as any).eq("id", id);
    if (error) { toast.error("Failed to save notes"); return; }
    toast.success("Notes saved");
    fetchApplications();
  };

  const openDetail = (app: Application) => {
    setSelectedApp(app);
    setNotes(app.admin_notes || "");
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader title="Applications" />
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Stats */}
          <div className="mb-6 grid gap-4 sm:grid-cols-5">
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{stats.total}</p><p className="text-sm text-muted-foreground">Total</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-amber-600">{stats.submitted}</p><p className="text-sm text-muted-foreground">New</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p><p className="text-sm text-muted-foreground">In Progress</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-600">{stats.approved}</p><p className="text-sm text-muted-foreground">Approved</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-destructive">{stats.unpaid}</p><p className="text-sm text-muted-foreground">Unpaid</p></CardContent></Card>
          </div>

          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-lg">All Applications</CardTitle>
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Search..." className="w-48 pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
                  </div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-32"><SelectValue placeholder="Type" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="Work Visa">Work Visa</SelectItem>
                      <SelectItem value="Study Visa">Study Visa</SelectItem>
                      <SelectItem value="Visit Visa">Visit Visa</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32"><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="submitted">Submitted</SelectItem>
                      <SelectItem value="under_review">Under Review</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="pending_documents">Pending Docs</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="py-8 text-center text-muted-foreground">Loading applications...</p>
              ) : filtered.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">No applications found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-muted-foreground">
                        <th className="pb-3 pr-4 font-medium">Reference</th>
                        <th className="pb-3 pr-4 font-medium">Applicant</th>
                        <th className="pb-3 pr-4 font-medium hidden sm:table-cell">Type</th>
                        <th className="pb-3 pr-4 font-medium hidden md:table-cell">Country</th>
                        <th className="pb-3 pr-4 font-medium">Status</th>
                        <th className="pb-3 pr-4 font-medium">Payment</th>
                        <th className="pb-3 pr-4 font-medium hidden lg:table-cell">Submitted</th>
                        <th className="pb-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((a) => {
                        const fd = a.form_data || {};
                        const name = fd.fullName || fd.full_name || "—";
                        return (
                          <tr key={a.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30">
                            <td className="py-3 pr-4 font-medium text-primary">{a.reference_number}</td>
                            <td className="py-3 pr-4">
                              <p className="font-medium">{name}</p>
                              <p className="text-xs text-muted-foreground">{fd.email || ""}</p>
                            </td>
                            <td className="py-3 pr-4 hidden sm:table-cell">{a.application_type}</td>
                            <td className="py-3 pr-4 hidden md:table-cell">{a.destination_country || fd.destinationCountry || fd.destCountry || "—"}</td>
                            <td className="py-3 pr-4">
                              <Badge variant={STATUS_COLORS[a.status] || "secondary"}>
                                {STATUS_LABELS[a.status] || a.status}
                              </Badge>
                            </td>
                            <td className="py-3 pr-4">
                              <Badge variant={a.payment_status === "paid" ? "default" : a.payment_status === "unpaid" ? "secondary" : "outline"}>
                                {a.payment_status}
                              </Badge>
                            </td>
                            <td className="py-3 pr-4 hidden lg:table-cell text-muted-foreground">
                              {new Date(a.created_at).toLocaleDateString()}
                            </td>
                            <td className="py-3">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => openDetail(a)}>
                                    <Eye className="mr-2 h-4 w-4" />View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => updateStatus(a.id, "under_review")}>
                                    <Clock className="mr-2 h-4 w-4" />Mark Under Review
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => updateStatus(a.id, "in_progress")}>
                                    <FileText className="mr-2 h-4 w-4" />Mark In Progress
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => updateStatus(a.id, "pending_documents")}>
                                    <FileText className="mr-2 h-4 w-4" />Request Documents
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => updateStatus(a.id, "approved")}>
                                    <CheckCircle className="mr-2 h-4 w-4" />Approve
                                  </DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive" onClick={() => updateStatus(a.id, "rejected")}>
                                    <XCircle className="mr-2 h-4 w-4" />Reject
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedApp} onOpenChange={(open) => !open && setSelectedApp(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          {selectedApp && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  {selectedApp.reference_number}
                  <Badge variant={STATUS_COLORS[selectedApp.status] || "secondary"}>
                    {STATUS_LABELS[selectedApp.status] || selectedApp.status}
                  </Badge>
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div><p className="text-xs text-muted-foreground">Type</p><p className="font-medium">{selectedApp.application_type}</p></div>
                  <div><p className="text-xs text-muted-foreground">Country</p><p className="font-medium">{selectedApp.destination_country || "—"}</p></div>
                  <div><p className="text-xs text-muted-foreground">Submitted</p><p className="font-medium">{new Date(selectedApp.created_at).toLocaleString()}</p></div>
                  <div><p className="text-xs text-muted-foreground">Last Updated</p><p className="font-medium">{new Date(selectedApp.updated_at).toLocaleString()}</p></div>
                  <div><p className="text-xs text-muted-foreground">Payment Status</p><p className="font-medium capitalize">{selectedApp.payment_status}</p></div>
                  <div>
                    <p className="text-xs text-muted-foreground">Payment Link</p>
                    <Link to="/admin/payments" className="text-sm text-primary underline">View Payments →</Link>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Form Data</h3>
                  <div className="rounded-lg border bg-muted/30 p-4 space-y-2">
                    {Object.entries(selectedApp.form_data || {}).map(([key, val]) => (
                      <div key={key} className="flex gap-2 text-sm">
                        <span className="text-muted-foreground min-w-[140px] capitalize">{key.replace(/([A-Z])/g, " $1").trim()}:</span>
                        <span className="font-medium">{String(val)}</span>
                      </div>
                    ))}
                    {Object.keys(selectedApp.form_data || {}).length === 0 && (
                      <p className="text-sm text-muted-foreground">No form data recorded.</p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Update Status</h3>
                  <div className="flex flex-wrap gap-2">
                    {["submitted", "under_review", "in_progress", "pending_documents", "approved", "rejected"].map((s) => (
                      <Button
                        key={s}
                        variant={selectedApp.status === s ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateStatus(selectedApp.id, s)}
                      >
                        {STATUS_LABELS[s]}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Admin Notes</h3>
                  <Textarea rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Internal notes about this application..." />
                  <Button className="mt-2" size="sm" onClick={() => saveNotes(selectedApp.id)}>Save Notes</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
