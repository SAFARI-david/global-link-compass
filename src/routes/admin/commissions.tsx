import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, Clock, CheckCircle, RefreshCw, Settings2 } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/commissions")({
  head: () => ({ meta: [{ title: "Commissions — Admin" }] }),
  component: AdminCommissionsPage,
});

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-blue-100 text-blue-700",
  paid: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

function AdminCommissionsPage() {
  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [defaultPct, setDefaultPct] = useState("10");
  const [editPct, setEditPct] = useState("10");
  const [settingsOpen, setSettingsOpen] = useState(false);

  useEffect(() => { load(); }, [statusFilter]);

  async function load() {
    setLoading(true);
    try {
      let q = supabase.from("commissions").select("*").order("created_at", { ascending: false });
      if (statusFilter !== "all") q = q.eq("status", statusFilter as any);
      const { data, error } = await q;
      if (error) throw error;
      setCommissions(data || []);

      const { data: settings } = await supabase
        .from("commission_settings")
        .select("*")
        .eq("setting_key", "default_commission_percentage")
        .single();
      if (settings) {
        setDefaultPct(settings.setting_value);
        setEditPct(settings.setting_value);
      }
    } catch {
      toast.error("Failed to load commissions");
    } finally {
      setLoading(false);
    }
  }

  async function updateCommissionStatus(id: string, status: string) {
    try {
      const updateObj: any = { status };
      if (status === "paid") updateObj.paid_at = new Date().toISOString();
      const { error } = await supabase.from("commissions").update(updateObj).eq("id", id);
      if (error) throw error;
      toast.success(`Commission ${status}`);
      load();
    } catch {
      toast.error("Failed to update commission");
    }
  }

  async function saveDefaultPct() {
    try {
      const { error } = await supabase
        .from("commission_settings")
        .update({ setting_value: editPct } as any)
        .eq("setting_key", "default_commission_percentage");
      if (error) throw error;
      setDefaultPct(editPct);
      setSettingsOpen(false);
      toast.success("Default commission rate updated");
    } catch {
      toast.error("Failed to update setting");
    }
  }

  const stats = {
    totalEarned: commissions.filter((c) => c.status === "paid").reduce((s, c) => s + Number(c.commission_amount), 0),
    totalPending: commissions.filter((c) => c.status === "pending").reduce((s, c) => s + Number(c.commission_amount), 0),
    totalApproved: commissions.filter((c) => c.status === "approved").reduce((s, c) => s + Number(c.commission_amount), 0),
    count: commissions.length,
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader title="Commissions" />
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Stats */}
          <div className="mb-6 grid gap-4 sm:grid-cols-4">
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600"><DollarSign className="h-5 w-5" /></div><div><p className="text-2xl font-bold">${stats.totalEarned.toLocaleString()}</p><p className="text-sm text-muted-foreground">Total Paid</p></div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600"><Clock className="h-5 w-5" /></div><div><p className="text-2xl font-bold">${stats.totalPending.toLocaleString()}</p><p className="text-sm text-muted-foreground">Pending</p></div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600"><CheckCircle className="h-5 w-5" /></div><div><p className="text-2xl font-bold">${stats.totalApproved.toLocaleString()}</p><p className="text-sm text-muted-foreground">Approved</p></div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><TrendingUp className="h-5 w-5" /></div><div><p className="text-2xl font-bold">{defaultPct}%</p><p className="text-sm text-muted-foreground">Default Rate</p></div></div></CardContent></Card>
          </div>

          {/* Table */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle className="text-lg">Commission Records</CardTitle>
              <div className="flex items-center gap-3">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-36"><SelectValue placeholder="All" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm"><Settings2 className="mr-1 h-4 w-4" /> Settings</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader><DialogTitle>Commission Settings</DialogTitle></DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Default Commission Rate (%)</label>
                        <Input type="number" min="0" max="100" value={editPct} onChange={(e) => setEditPct(e.target.value)} className="mt-1" />
                      </div>
                      <Button onClick={saveDefaultPct}>Save</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button variant="outline" size="icon" onClick={load}><RefreshCw className="h-4 w-4" /></Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
              ) : commissions.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">No commission records yet. Commissions are auto-created when agent payments are marked as paid.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-muted-foreground">
                        <th className="pb-3 pr-4 font-medium">Agent</th>
                        <th className="pb-3 pr-4 font-medium">Payment</th>
                        <th className="pb-3 pr-4 font-medium">Total Amt</th>
                        <th className="pb-3 pr-4 font-medium">Rate</th>
                        <th className="pb-3 pr-4 font-medium">Commission</th>
                        <th className="pb-3 pr-4 font-medium">Status</th>
                        <th className="pb-3 pr-4 font-medium hidden md:table-cell">Date</th>
                        <th className="pb-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {commissions.map((c) => (
                        <tr key={c.id} className="border-b border-border/50 last:border-0">
                          <td className="py-3 pr-4 font-mono text-xs">{c.agent_id?.slice(0, 8)}…</td>
                          <td className="py-3 pr-4 font-mono text-xs">{c.payment_id?.slice(0, 8)}…</td>
                          <td className="py-3 pr-4">${Number(c.total_payment_amount).toFixed(2)}</td>
                          <td className="py-3 pr-4">{c.commission_percentage}%</td>
                          <td className="py-3 pr-4 font-semibold text-green-600">${Number(c.commission_amount).toFixed(2)}</td>
                          <td className="py-3 pr-4">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[c.status] || "bg-muted"}`}>
                              {c.status}
                            </span>
                          </td>
                          <td className="py-3 pr-4 hidden md:table-cell text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
                          <td className="py-3">
                            <Select value={c.status} onValueChange={(v) => updateCommissionStatus(c.id, v)}>
                              <SelectTrigger className="h-7 w-28 text-xs"><SelectValue /></SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="paid">Paid</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
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
