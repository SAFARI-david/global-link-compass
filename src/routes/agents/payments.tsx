import { createFileRoute } from "@tanstack/react-router";
import { Download, CreditCard } from "lucide-react";
import { AgentSidebar } from "@/components/agent/AgentSidebar";
import { AgentHeader } from "@/components/agent/AgentHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/agents/payments")({
  head: () => ({ meta: [{ title: "Payments — Agent Portal" }] }),
  component: PaymentsPage,
});

const payments = [
  { id: "INV-001", client: "Mohammed Al-Rashid", ref: "WV-2024-0012", amount: "$350", status: "Paid", date: "2024-03-15" },
  { id: "INV-002", client: "Priya Sharma", ref: "SV-2024-0008", amount: "$300", status: "Pending", date: "2024-03-14" },
  { id: "INV-003", client: "David Chen", ref: "WV-2024-0011", amount: "$350", status: "Paid", date: "2024-03-12" },
  { id: "INV-004", client: "Fatima Zahra", ref: "WV-2024-0010", amount: "$350", status: "Paid", date: "2024-03-10" },
  { id: "INV-005", client: "Ahmed Hassan", ref: "WV-2024-0008", amount: "$350", status: "Overdue", date: "2024-02-25" },
];

function PaymentsPage() {
  return (
    <div className="flex min-h-screen bg-surface">
      <AgentSidebar />
      <div className="flex flex-1 flex-col">
        <AgentHeader />
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <h1 className="mb-6 text-2xl font-bold text-foreground">Payments & Invoices</h1>

          <div className="mb-8 grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Total Paid</p>
                <p className="mt-1 text-2xl font-bold text-green-600">$1,400</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="mt-1 text-2xl font-bold text-orange-500">$300</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-5">
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="mt-1 text-2xl font-bold text-destructive">$350</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Invoice History</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="p-4 font-medium">Invoice</th>
                      <th className="p-4 font-medium">Client</th>
                      <th className="p-4 font-medium hidden sm:table-cell">Application</th>
                      <th className="p-4 font-medium">Amount</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium hidden md:table-cell">Date</th>
                      <th className="p-4 font-medium w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.id} className="border-b border-border/50 last:border-0">
                        <td className="p-4 font-medium">{p.id}</td>
                        <td className="p-4">{p.client}</td>
                        <td className="p-4 hidden sm:table-cell text-primary">{p.ref}</td>
                        <td className="p-4 font-semibold">{p.amount}</td>
                        <td className="p-4">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            p.status === "Paid" ? "bg-green-100 text-green-700" :
                            p.status === "Pending" ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                          }`}>{p.status}</span>
                        </td>
                        <td className="p-4 hidden md:table-cell text-muted-foreground">{p.date}</td>
                        <td className="p-4">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Download className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
