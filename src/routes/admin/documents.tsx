import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, RefreshCw, FileText, CheckCircle, XCircle, Clock, Eye, Download } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/documents")({
  head: () => ({ meta: [{ title: "Documents — Admin" }] }),
  component: AdminDocumentsPage,
});

const DOC_TYPES: Record<string, string> = {
  passport: "Passport",
  cv: "CV / Resume",
  qualification: "Qualification",
  photo: "Passport Photo",
  cover_letter: "Cover Letter",
  reference_letter: "Reference Letter",
  financial_proof: "Financial Proof",
  other: "Other",
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700", icon: Clock },
  approved: { label: "Approved", color: "bg-green-100 text-green-700", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700", icon: XCircle },
};

function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [reviewNotes, setReviewNotes] = useState("");
  const [reviewingDoc, setReviewingDoc] = useState<any>(null);

  useEffect(() => { load(); }, [statusFilter]);

  async function load() {
    setLoading(true);
    try {
      let q = supabase.from("documents").select("*").order("created_at", { ascending: false });
      if (statusFilter !== "all") q = q.eq("status", statusFilter as "pending" | "approved" | "rejected");
      const { data, error } = await q;
      if (error) throw error;
      setDocuments(data || []);
    } catch {
      toast.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  }

  async function reviewDocument(docId: string, status: "approved" | "rejected") {
    try {
      const { error } = await supabase
        .from("documents")
        .update({
          status,
          admin_notes: reviewNotes || null,
          reviewed_at: new Date().toISOString(),
        } as any)
        .eq("id", docId);
      if (error) throw error;
      toast.success(`Document ${status}`);
      setReviewingDoc(null);
      setReviewNotes("");
      load();
    } catch {
      toast.error("Failed to update");
    }
  }

  async function downloadDocument(doc: any) {
    try {
      const { data, error } = await supabase.storage
        .from("applicant-documents")
        .createSignedUrl(doc.file_path, 300);
      if (error) throw error;
      window.open(data.signedUrl, "_blank");
    } catch {
      toast.error("Failed to download");
    }
  }

  const filtered = documents.filter(
    (d) =>
      d.file_name?.toLowerCase().includes(search.toLowerCase()) ||
      d.document_type?.toLowerCase().includes(search.toLowerCase()),
  );

  const stats = {
    total: documents.length,
    pending: documents.filter((d) => d.status === "pending").length,
    approved: documents.filter((d) => d.status === "approved").length,
    rejected: documents.filter((d) => d.status === "rejected").length,
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader title="Documents" />
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Stats */}
          <div className="mb-6 grid gap-4 sm:grid-cols-4">
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><FileText className="h-5 w-5" /></div><div><p className="text-2xl font-bold">{stats.total}</p><p className="text-sm text-muted-foreground">Total</p></div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600"><Clock className="h-5 w-5" /></div><div><p className="text-2xl font-bold">{stats.pending}</p><p className="text-sm text-muted-foreground">Pending Review</p></div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600"><CheckCircle className="h-5 w-5" /></div><div><p className="text-2xl font-bold">{stats.approved}</p><p className="text-sm text-muted-foreground">Approved</p></div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-100 text-red-600"><XCircle className="h-5 w-5" /></div><div><p className="text-2xl font-bold">{stats.rejected}</p><p className="text-sm text-muted-foreground">Rejected</p></div></div></CardContent></Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle className="text-lg">Document Submissions</CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search…" className="w-44 pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={load}><RefreshCw className="h-4 w-4" /></Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
              ) : filtered.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">No documents found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-muted-foreground">
                        <th className="pb-3 pr-4 font-medium">File</th>
                        <th className="pb-3 pr-4 font-medium">Type</th>
                        <th className="pb-3 pr-4 font-medium hidden sm:table-cell">App ID</th>
                        <th className="pb-3 pr-4 font-medium">Status</th>
                        <th className="pb-3 pr-4 font-medium hidden md:table-cell">Date</th>
                        <th className="pb-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((doc) => {
                        const statusConf = STATUS_CONFIG[doc.status] || STATUS_CONFIG.pending;
                        const StatusIcon = statusConf.icon;
                        return (
                          <tr key={doc.id} className="border-b border-border/50 last:border-0">
                            <td className="py-3 pr-4">
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium truncate max-w-[200px]">{doc.file_name}</span>
                              </div>
                            </td>
                            <td className="py-3 pr-4">
                              <Badge variant="secondary" className="text-xs">{DOC_TYPES[doc.document_type] || doc.document_type}</Badge>
                            </td>
                            <td className="py-3 pr-4 hidden sm:table-cell text-xs text-muted-foreground font-mono">{doc.application_id?.slice(0, 8)}…</td>
                            <td className="py-3 pr-4">
                              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusConf.color}`}>
                                <StatusIcon className="h-3 w-3" /> {statusConf.label}
                              </span>
                            </td>
                            <td className="py-3 pr-4 hidden md:table-cell text-muted-foreground">{new Date(doc.created_at).toLocaleDateString()}</td>
                            <td className="py-3">
                              <div className="flex items-center gap-1">
                                <Button variant="ghost" size="sm" className="h-7 text-xs gap-1" onClick={() => downloadDocument(doc)}>
                                  <Download className="h-3.5 w-3.5" /> View
                                </Button>
                                {doc.status === "pending" && (
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => { setReviewingDoc(doc); setReviewNotes(""); }}>
                                        Review
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                      <DialogHeader><DialogTitle>Review: {doc.file_name}</DialogTitle></DialogHeader>
                                      <div className="space-y-4">
                                        <div className="grid grid-cols-2 gap-3 text-sm">
                                          <div><p className="text-xs text-muted-foreground">Type</p><p>{DOC_TYPES[doc.document_type] || doc.document_type}</p></div>
                                          <div><p className="text-xs text-muted-foreground">Size</p><p>{(doc.file_size / 1024).toFixed(1)} KB</p></div>
                                          <div><p className="text-xs text-muted-foreground">Uploaded</p><p>{new Date(doc.created_at).toLocaleString()}</p></div>
                                          <div><p className="text-xs text-muted-foreground">MIME</p><p>{doc.mime_type}</p></div>
                                        </div>
                                        <Button variant="outline" size="sm" className="w-full gap-2" onClick={() => downloadDocument(doc)}>
                                          <Eye className="h-4 w-4" /> Open Document
                                        </Button>
                                        <div>
                                          <label className="text-xs font-medium text-muted-foreground mb-1 block">Notes (optional)</label>
                                          <Textarea placeholder="Add review notes…" value={reviewNotes} onChange={(e) => setReviewNotes(e.target.value)} rows={2} />
                                        </div>
                                        <div className="flex gap-2">
                                          <Button className="flex-1 gap-1" onClick={() => reviewDocument(doc.id, "approved")}>
                                            <CheckCircle className="h-4 w-4" /> Approve
                                          </Button>
                                          <Button variant="destructive" className="flex-1 gap-1" onClick={() => reviewDocument(doc.id, "rejected")}>
                                            <XCircle className="h-4 w-4" /> Reject
                                          </Button>
                                        </div>
                                      </div>
                                    </DialogContent>
                                  </Dialog>
                                )}
                              </div>
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
    </div>
  );
}