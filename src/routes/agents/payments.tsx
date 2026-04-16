import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Download, CreditCard, RefreshCw, Eye } from "lucide-react";
import { AgentSidebar } from "@/components/agent/AgentSidebar";
import { AgentHeader } from "@/components/agent/AgentHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/agents/payments")({
  head: () => ({ meta: [{ title: "Payments — Agent Portal" }] }),
  component: PaymentsPage,
});

const statusColors: Record<string, string> = {
  unpaid: "bg-muted text-muted-foreground",
  pending: "bg-amber-100 text-amber-700",
  paid: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
  refunded: "bg-purple-100 text-purple-700",
  pending_verification: "bg-blue-100 text-blue-700",
};

function PaymentsPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadPayments(); }, []);

  async function loadPayments() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("payments")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setPayments(data || []);
    } catch {
      toast.error("Failed to load payments");
    } finally {
      setLoading(false);
    }
  }

  const totalPaid = payments.filter((p) => p.payment_status === "paid").reduce((s, p) => s + Number(p.amount), 0);
  const totalPending = payments.filter((p) => p.payment_status === "pending" || p.payment_status === "unpaid").reduce((s, p) => s + Number(p.amount), 0);
  const totalFailed = payments.filter((p) => p.payment_status === "failed").reduce((s, p) => s + Number(p.amount), 0);

  return (
    <div className="flex min-h-screen bg-surface">
      <AgentSidebar />
      <div className="flex flex-1 flex-col">
        <AgentHeader />
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Payments & Invoices</h1>
            <Button variant="outline" size="sm" onClick={loadPayments}><RefreshCw className="mr-1 h-4 w-4" /> Refresh</Button>
          </div>

          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="mt-1 text-2xl font-bold text-green-600">${totalPaid.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="mt-1 text-2xl font-bold text-amber-500">${totalPending.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="mt-1 text-2xl font-bold text-destructive">${totalFailed.toLocaleString()}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
              ) : payments.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">No payment records yet.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-muted-foreground">
                        <th className="p-4 font-medium">Reference</th>
                        <th className="p-4 font-medium">Service</th>
                        <th className="p-4 font-medium hidden sm:table-cell">Country</th>
                        <th className="p-4 font-medium">Amount</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium hidden md:table-cell">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.map((p) => (
                        <tr key={p.id} className="border-b border-border/50 last:border-0">
                          <td className="p-4 font-medium text-primary">{p.internal_reference}</td>
                          <td className="p-4">{p.service_type || p.visa_type || "—"}</td>
                          <td className="p-4 hidden sm:table-cell">{p.country || "—"}</td>
                          <td className="p-4 font-semibold">${Number(p.amount).toFixed(2)}</td>
                          <td className="p-4">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusColors[p.payment_status] || "bg-muted text-muted-foreground"}`}>
                              {p.payment_status}
                            </span>
                          </td>
                          <td className="p-4 hidden md:table-cell text-muted-foreground">{new Date(p.created_at).toLocaleDateString()}</td>
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
