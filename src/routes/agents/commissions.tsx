import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, Clock, CheckCircle, RefreshCw } from "lucide-react";
import { AgentSidebar } from "@/components/agent/AgentSidebar";
import { AgentHeader } from "@/components/agent/AgentHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/agents/commissions")({
  head: () => ({ meta: [{ title: "My Earnings — Agent Portal" }] }),
  component: AgentCommissionsPage,
});

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-blue-100 text-blue-700",
  paid: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
};

function AgentCommissionsPage() {
  const [commissions, setCommissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  async function load() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("commissions")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setCommissions(data || []);
    } catch {
      toast.error("Failed to load earnings");
    } finally {
      setLoading(false);
    }
  }

  const totalPaid = commissions.filter((c) => c.status === "paid").reduce((s, c) => s + Number(c.commission_amount), 0);
  const totalPending = commissions.filter((c) => c.status === "pending" || c.status === "approved").reduce((s, c) => s + Number(c.commission_amount), 0);
  const totalAll = commissions.reduce((s, c) => s + Number(c.commission_amount), 0);

  return (
    <div className="flex min-h-screen bg-surface">
      <AgentSidebar />
      <div className="flex flex-1 flex-col">
        <AgentHeader />
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">My Earnings</h1>
            <Button variant="outline" size="sm" onClick={load}><RefreshCw className="mr-1 h-4 w-4" /> Refresh</Button>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600"><DollarSign className="h-5 w-5" /></div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">${totalPaid.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Total Earned (Paid)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600"><Clock className="h-5 w-5" /></div>
                  <div>
                    <p className="text-2xl font-bold text-amber-500">${totalPending.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Pending / Approved</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><TrendingUp className="h-5 w-5" /></div>
                  <div>
                    <p className="text-2xl font-bold">${totalAll.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">Lifetime Total</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <Card>
            <CardHeader><CardTitle className="text-lg">Commission History</CardTitle></CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
              ) : commissions.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">
                  <p className="mb-2">No earnings yet.</p>
                  <p className="text-xs">Commissions are generated automatically when your client payments are confirmed.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-muted-foreground">
                        <th className="p-4 font-medium">Payment</th>
                        <th className="p-4 font-medium">Client Payment</th>
                        <th className="p-4 font-medium">Rate</th>
                        <th className="p-4 font-medium">Your Commission</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium hidden md:table-cell">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {commissions.map((c) => (
                        <tr key={c.id} className="border-b border-border/50 last:border-0">
                          <td className="p-4 font-mono text-xs">{c.payment_id?.slice(0, 8)}…</td>
                          <td className="p-4">${Number(c.total_payment_amount).toFixed(2)}</td>
                          <td className="p-4">{c.commission_percentage}%</td>
                          <td className="p-4 font-semibold text-green-600">${Number(c.commission_amount).toFixed(2)}</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[c.status] || "bg-muted"}`}>
                              {c.status}
                            </span>
                          </td>
                          <td className="p-4 hidden md:table-cell text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</td>
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
