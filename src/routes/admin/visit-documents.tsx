import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Search,
  RefreshCw,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  Download,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  User,
} from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/visit-documents")({
  head: () => ({ meta: [{ title: "Visit Visa Documents — Admin" }] }),
  component: VisitDocumentsPage,
});

const DOC_TYPES: Record<string, string> = {
  passport: "Passport",
  cv: "CV / Resume",
  qualification: "Qualification",
  photo: "Passport Photo",
  cover_letter: "Cover Letter",
  reference_letter: "Reference Letter",
  financial_proof: "Financial Proof / Bank Statement",
  travel_itinerary: "Travel Itinerary",
  hotel_booking: "Hotel Booking",
  invitation_letter: "Invitation Letter",
  travel_insurance: "Travel Insurance",
  other: "Other",
};

const STATUS_CONFIG: Record<string, { label: string; cls: string; icon: typeof Clock }> = {
  pending: { label: "Pending Review", cls: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
  approved: { label: "Approved", cls: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle },
  rejected: { label: "Changes Requested", cls: "bg-red-100 text-red-700 border-red-200", icon: AlertCircle },
};

type DocRow = {
  id: string;
  application_id: string;
  user_id: string;
  document_type: string;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string | null;
  status: "pending" | "approved" | "rejected";
  admin_notes: string | null;
  reviewed_at: string | null;
  created_at: string;
};

type AppRow = {
  id: string;
  reference_number: string;
  application_type: string;
  status: string;
  created_at: string;
  user_id: string | null;
  form_data: any;
  documents: DocRow[];
};

function VisitDocumentsPage() {
  const [apps, setApps] = useState<AppRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected" | "incomplete">("all");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [reviewing, setReviewing] = useState<DocRow | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewMode, setReviewMode] = useState<"approve" | "request_changes">("approve");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    try {
      const { data: apps, error: appsErr } = await supabase
        .from("applications")
        .select("id, reference_number, application_type, status, created_at, user_id, form_data")
        .eq("application_type", "Visit Visa")
        .order("created_at", { ascending: false });
      if (appsErr) throw appsErr;

      const ids = (apps || []).map((a) => a.id);
      let docs: DocRow[] = [];
      if (ids.length) {
        const { data: docsData, error: docsErr } = await supabase
          .from("documents")
          .select("*")
          .in("application_id", ids)
          .order("created_at", { ascending: false });
        if (docsErr) throw docsErr;
        docs = (docsData as any) || [];
      }

      const grouped: AppRow[] = (apps || []).map((a) => ({
        ...(a as any),
        documents: docs.filter((d) => d.application_id === a.id),
      }));
      setApps(grouped);
    } catch (e: any) {
      toast.error(e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  async function downloadDoc(doc: DocRow) {
    try {
      const { data, error } = await supabase.storage
        .from("applicant-documents")
        .createSignedUrl(doc.file_path, 300);
      if (error) throw error;
      window.open(data.signedUrl, "_blank");
    } catch {
      toast.error("Failed to open document");
    }
  }

  async function submitReview() {
    if (!reviewing) return;
    if (reviewMode === "request_changes" && !reviewNotes.trim()) {
      toast.error("Please describe what needs to change.");
      return;
    }
    setSubmitting(true);
    try {
      const newStatus = reviewMode === "approve" ? "approved" : "rejected";
      const { error } = await supabase
        .from("documents")
        .update({
          status: newStatus,
          admin_notes: reviewNotes.trim() || null,
          reviewed_at: new Date().toISOString(),
        } as any)
        .eq("id", reviewing.id);
      if (error) throw error;
      toast.success(reviewMode === "approve" ? "Document approved" : "Changes requested");
      setReviewing(null);
      setReviewNotes("");
      load();
    } catch (e: any) {
      toast.error(e?.message || "Failed to update");
    } finally {
      setSubmitting(false);
    }
  }

  function appStatus(a: AppRow): "pending" | "approved" | "rejected" | "incomplete" {
    if (!a.documents.length) return "incomplete";
    if (a.documents.some((d) => d.status === "rejected")) return "rejected";
    if (a.documents.some((d) => d.status === "pending")) return "pending";
    return "approved";
  }

  const filtered = apps.filter((a) => {
    const s = search.toLowerCase();
    const fd = a.form_data || {};
    const fullName = `${fd.firstName || ""} ${fd.lastName || ""}`.toLowerCase();
    const matchesSearch =
      !s ||
      a.reference_number?.toLowerCase().includes(s) ||
      fullName.includes(s) ||
      fd.email?.toLowerCase().includes(s) ||
      fd.destination?.toLowerCase().includes(s);
    const matchesStatus = statusFilter === "all" || appStatus(a) === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: apps.length,
    pending: apps.filter((a) => appStatus(a) === "pending").length,
    approved: apps.filter((a) => appStatus(a) === "approved").length,
    changes: apps.filter((a) => appStatus(a) === "rejected").length,
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader title="Visit Visa Documents" />
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mb-6 grid gap-4 sm:grid-cols-4">
            <StatCard icon={FileText} color="primary" value={stats.total} label="Applications" />
            <StatCard icon={Clock} color="amber" value={stats.pending} label="Pending Review" />
            <StatCard icon={CheckCircle} color="green" value={stats.approved} label="All Approved" />
            <StatCard icon={AlertCircle} color="red" value={stats.changes} label="Changes Requested" />
          </div>

          <Card>
            <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-lg">Applications & Documents</CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search reference, name, email…"
                    className="w-64 pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending Review</SelectItem>
                    <SelectItem value="approved">All Approved</SelectItem>
                    <SelectItem value="rejected">Changes Requested</SelectItem>
                    <SelectItem value="incomplete">No Documents</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={load}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  No visit visa applications found.
                </div>
              ) : (
                <div className="space-y-3">
                  {filtered.map((a) => {
                    const st = appStatus(a);
                    const conf = STATUS_CONFIG[st === "incomplete" ? "pending" : st];
                    const StatusIcon = st === "incomplete" ? FileText : conf.icon;
                    const isOpen = !!expanded[a.id];
                    const fd = a.form_data || {};
                    const name =
                      `${fd.firstName || ""} ${fd.lastName || ""}`.trim() || "Anonymous applicant";
                    return (
                      <div key={a.id} className="rounded-lg border border-border bg-card">
                        <button
                          onClick={() => setExpanded((p) => ({ ...p, [a.id]: !p[a.id] }))}
                          className="flex w-full items-center justify-between gap-3 p-4 text-left transition-colors hover:bg-muted/50"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            {isOpen ? (
                              <ChevronDown className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                            ) : (
                              <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                            )}
                            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                              <User className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-semibold text-foreground">{name}</span>
                                <span className="font-mono text-xs text-muted-foreground">
                                  {a.reference_number}
                                </span>
                              </div>
                              <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                {fd.destination && <span>→ {fd.destination}</span>}
                                {fd.email && <span>{fd.email}</span>}
                                <span>{new Date(a.created_at).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex flex-shrink-0 items-center gap-3">
                            <span className="text-xs text-muted-foreground">
                              {a.documents.length} {a.documents.length === 1 ? "doc" : "docs"}
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                                st === "incomplete"
                                  ? "border-border bg-muted text-muted-foreground"
                                  : conf.cls
                              }`}
                            >
                              <StatusIcon className="h-3 w-3" />
                              {st === "incomplete" ? "No Documents" : conf.label}
                            </span>
                          </div>
                        </button>

                        {isOpen && (
                          <div className="border-t border-border p-4">
                            {a.documents.length === 0 ? (
                              <div className="py-4 text-center text-sm text-muted-foreground">
                                No documents uploaded for this application.
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {a.documents.map((doc) => {
                                  const dconf = STATUS_CONFIG[doc.status];
                                  const DIcon = dconf.icon;
                                  return (
                                    <div
                                      key={doc.id}
                                      className="flex flex-col gap-3 rounded-md border border-border/60 bg-surface p-3 sm:flex-row sm:items-center sm:justify-between"
                                    >
                                      <div className="flex min-w-0 items-center gap-3">
                                        <FileText className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                                        <div className="min-w-0">
                                          <div className="flex flex-wrap items-center gap-2">
                                            <span className="truncate text-sm font-medium">
                                              {doc.file_name}
                                            </span>
                                            <Badge variant="secondary" className="text-xs">
                                              {DOC_TYPES[doc.document_type] || doc.document_type}
                                            </Badge>
                                          </div>
                                          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                            <span>{(doc.file_size / 1024).toFixed(1)} KB</span>
                                            {doc.reviewed_at && (
                                              <span>
                                                Reviewed{" "}
                                                {new Date(doc.reviewed_at).toLocaleDateString()}
                                              </span>
                                            )}
                                            {doc.admin_notes && (
                                              <span className="italic">“{doc.admin_notes}”</span>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      <div className="flex flex-shrink-0 items-center gap-2">
                                        <span
                                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${dconf.cls}`}
                                        >
                                          <DIcon className="h-3 w-3" />
                                          {dconf.label}
                                        </span>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="h-7 gap-1 text-xs"
                                          onClick={() => downloadDoc(doc)}
                                        >
                                          <Download className="h-3.5 w-3.5" /> View
                                        </Button>
                                        <Dialog
                                          open={reviewing?.id === doc.id}
                                          onOpenChange={(o) => {
                                            if (!o) {
                                              setReviewing(null);
                                              setReviewNotes("");
                                            }
                                          }}
                                        >
                                          <DialogTrigger asChild>
                                            <Button
                                              size="sm"
                                              className="h-7 text-xs"
                                              onClick={() => {
                                                setReviewing(doc);
                                                setReviewNotes(doc.admin_notes || "");
                                                setReviewMode("approve");
                                              }}
                                            >
                                              Review
                                            </Button>
                                          </DialogTrigger>
                                          <DialogContent>
                                            <DialogHeader>
                                              <DialogTitle>Review document</DialogTitle>
                                              <DialogDescription>
                                                {doc.file_name} •{" "}
                                                {DOC_TYPES[doc.document_type] || doc.document_type}
                                              </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                              <Button
                                                variant="outline"
                                                size="sm"
                                                className="w-full gap-2"
                                                onClick={() => downloadDoc(doc)}
                                              >
                                                <Download className="h-4 w-4" /> Open Document
                                              </Button>
                                              <div className="grid grid-cols-2 gap-2">
                                                <Button
                                                  variant={reviewMode === "approve" ? "default" : "outline"}
                                                  className="gap-1"
                                                  onClick={() => setReviewMode("approve")}
                                                >
                                                  <CheckCircle className="h-4 w-4" /> Approve
                                                </Button>
                                                <Button
                                                  variant={
                                                    reviewMode === "request_changes" ? "default" : "outline"
                                                  }
                                                  className="gap-1"
                                                  onClick={() => setReviewMode("request_changes")}
                                                >
                                                  <AlertCircle className="h-4 w-4" /> Request Changes
                                                </Button>
                                              </div>
                                              <div>
                                                <label className="mb-1 block text-xs font-medium text-muted-foreground">
                                                  {reviewMode === "approve"
                                                    ? "Internal notes (optional)"
                                                    : "What needs to change? (required)"}
                                                </label>
                                                <Textarea
                                                  rows={3}
                                                  value={reviewNotes}
                                                  onChange={(e) => setReviewNotes(e.target.value)}
                                                  placeholder={
                                                    reviewMode === "approve"
                                                      ? "Add a note for the team…"
                                                      : "e.g. The passport scan is blurry, please re-upload a clearer copy."
                                                  }
                                                />
                                              </div>
                                            </div>
                                            <DialogFooter>
                                              <Button
                                                variant="ghost"
                                                onClick={() => setReviewing(null)}
                                                disabled={submitting}
                                              >
                                                Cancel
                                              </Button>
                                              <Button onClick={submitReview} disabled={submitting}>
                                                {submitting
                                                  ? "Saving…"
                                                  : reviewMode === "approve"
                                                    ? "Approve Document"
                                                    : "Send Request"}
                                              </Button>
                                            </DialogFooter>
                                          </DialogContent>
                                        </Dialog>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  color,
  value,
  label,
}: {
  icon: typeof Clock;
  color: "primary" | "amber" | "green" | "red";
  value: number;
  label: string;
}) {
  const colorMap: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    amber: "bg-amber-100 text-amber-600",
    green: "bg-green-100 text-green-600",
    red: "bg-red-100 text-red-600",
  };
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${colorMap[color]}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-sm text-muted-foreground">{label}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
