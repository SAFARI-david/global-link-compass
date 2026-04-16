import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, Download, DollarSign, TrendingUp, AlertTriangle, CheckCircle, XCircle, Eye, StickyNote, RefreshCw } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/payments")({
  head: () => ({
    meta: [
      { title: "Manage Payments — Admin" },
      { name: "description", content: "View and manage all platform payments." },
    ],
  }),
  component: AdminPaymentsPage,
});

const STATUS_OPTIONS = [
  { value: "all", label: "All Statuses" },
  { value: "unpaid", label: "Unpaid" },
  { value: "pending", label: "Pending" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
  { value: "pending_verification", label: "Pending Verification" },
];

const statusColors: Record<string, string> = {
  unpaid: "bg-muted text-muted-foreground",
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-purple-100 text-purple-700",
  pending_verification: "bg-blue-100 text-blue-700",
};

function AdminPaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [noteText, setNoteText] = useState("");

  useEffect(() => { loadPayments(); }, [statusFilter]);

  async function loadPayments() {
    setLoading(true);
    try {
      let query = supabase.from("payments").select("*").order("created_at", { ascending: false });
      if (statusFilter !== "all") query = query.eq("payment_status", statusFilter as any);
      const { data, error } = await query;
      if (error) throw error;
      setPayments(data || []);
    } catch (err) {
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(paymentId: string, status: string) {
    try {
      const updateObj: any = { payment_status: status };
      if (status === "paid") updateObj.paid_at = new Date().toISOString();
      const { error } = await supabase.from("payments").update(updateObj as any).eq("id", paymentId);
      if (error) throw error;
      toast.success("Payment status updated");
      loadPayments();
    } catch {
      toast.error("Failed to update status");
    }
  }

  async function addNote(paymentId: string) {
    if (!noteText.trim()) return;
    try {
      const { error } = await supabase.from("payments").update({ notes: noteText } as any).eq("id", paymentId);
      if (error) throw error;
      toast.success("Note saved");
      setNoteText("");
      loadPayments();
    } catch {
      toast.error("Failed to save note");
    }
  }

  const filtered = payments.filter(
    (p) =>
      (p.internal_reference || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.country || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.visa_type || "").toLowerCase().includes(search.toLowerCase()) ||
      (p.service_type || "").toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: payments.reduce((s, p) => s + (p.payment_status === "paid" ? Number(p.amount) : 0), 0),
    pending: payments.filter((p) => p.payment_status === "pending" || p.payment_status === "unpaid").length,
    paid: payments.filter((p) => p.payment_status === "paid").length,
    failed: payments.filter((p) => p.payment_status === "failed").length,
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader title="Payments" />
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Stats */}
          <div className="mb-6 grid gap-4 sm:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">${stats.total.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Collected</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{payments.length}</p>
                    <p className="text-sm text-muted-foreground">Total Records</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                    <AlertTriangle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.pending}</p>
                    <p className="text-sm text-muted-foreground">Pending / Unpaid</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stats.paid}</p>
                    <p className="text-sm text-muted-foreground">Paid</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters & Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle className="text-lg">Payment Records</CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search..." className="w-48 pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((o) => (
                      <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={loadPayments}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">No payment records found.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-muted-foreground">
                        <th className="pb-3 pr-4 font-medium">Reference</th>
                        <th className="pb-3 pr-4 font-medium">Service</th>
                        <th className="pb-3 pr-4 font-medium hidden sm:table-cell">Country</th>
                        <th className="pb-3 pr-4 font-medium">Amount</th>
                        <th className="pb-3 pr-4 font-medium">Status</th>
                        <th className="pb-3 pr-4 font-medium hidden md:table-cell">Payer</th>
                        <th className="pb-3 pr-4 font-medium hidden lg:table-cell">Date</th>
                        <th className="pb-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((p) => (
                        <tr key={p.id} className="border-b border-border/50 last:border-0">
                          <td className="py-3 pr-4 font-medium text-primary">{p.internal_reference}</td>
                          <td className="py-3 pr-4">{p.service_type || p.visa_type || "—"}</td>
                          <td className="py-3 pr-4 hidden sm:table-cell">{p.country || "—"}</td>
                          <td className="py-3 pr-4 font-semibold">${Number(p.amount).toFixed(2)} <span className="text-xs text-muted-foreground">{p.currency}</span></td>
                          <td className="py-3 pr-4">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[p.payment_status] || "bg-muted text-muted-foreground"}`}>
                              {p.payment_status}
                            </span>
                          </td>
                          <td className="py-3 pr-4 hidden md:table-cell capitalize">{p.payer_type}</td>
                          <td className="py-3 pr-4 hidden lg:table-cell text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</td>
                          <td className="py-3">
                            <div className="flex items-center gap-1">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setSelectedPayment(p); setNoteText(p.notes || ""); }}>
                                    <Eye className="h-3.5 w-3.5" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-lg">
                                  <DialogHeader>
                                    <DialogTitle>Payment: {p.internal_reference}</DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-3 text-sm">
                                    <div className="grid grid-cols-2 gap-2">
                                      <div><p className="text-xs text-muted-foreground">Amount</p><p className="font-semibold">${Number(p.amount).toFixed(2)} {p.currency}</p></div>
                                      <div><p className="text-xs text-muted-foreground">Status</p><p className="font-semibold capitalize">{p.payment_status}</p></div>
                                      <div><p className="text-xs text-muted-foreground">Service</p><p>{p.service_type || "—"}</p></div>
                                      <div><p className="text-xs text-muted-foreground">Country</p><p>{p.country || "—"}</p></div>
                                      <div><p className="text-xs text-muted-foreground">Visa Type</p><p>{p.visa_type || "—"}</p></div>
                                      <div><p className="text-xs text-muted-foreground">Payer</p><p className="capitalize">{p.payer_type}</p></div>
                                      <div><p className="text-xs text-muted-foreground">Provider</p><p className="capitalize">{p.provider}</p></div>
                                      <div><p className="text-xs text-muted-foreground">Paid At</p><p>{p.paid_at ? new Date(p.paid_at).toLocaleString() : "—"}</p></div>
                                      {p.whop_payment_id && <div><p className="text-xs text-muted-foreground">Whop Payment ID</p><p className="font-mono text-xs">{p.whop_payment_id}</p></div>}
                                      {p.whop_checkout_reference && <div><p className="text-xs text-muted-foreground">Whop Checkout Ref</p><p className="font-mono text-xs">{p.whop_checkout_reference}</p></div>}
                                    </div>
                                    {p.application_id && (
                                      <div>
                                        <p className="text-xs text-muted-foreground mb-1">Linked Application</p>
                                        <Link to="/admin/applications" className="text-primary underline text-xs">{p.application_id}</Link>
                                      </div>
                                    )}
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">Update Status</p>
                                      <Select value={p.payment_status} onValueChange={(v) => updateStatus(p.id, v)}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                          <SelectItem value="unpaid">Unpaid</SelectItem>
                                          <SelectItem value="pending">Pending</SelectItem>
                                          <SelectItem value="paid">Paid</SelectItem>
                                          <SelectItem value="failed">Failed</SelectItem>
                                          <SelectItem value="refunded">Refunded</SelectItem>
                                          <SelectItem value="pending_verification">Pending Verification</SelectItem>
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">Admin Notes</p>
                                      <Textarea value={noteText} onChange={(e) => setNoteText(e.target.value)} placeholder="Add a note..." rows={3} />
                                      <Button size="sm" className="mt-2" onClick={() => addNote(p.id)}>Save Note</Button>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </td>
                        </tr>
                      ))}
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
