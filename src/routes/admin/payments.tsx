import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Download, DollarSign, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/payments")({
  head: () => ({
    meta: [
      { title: "Manage Payments — Admin" },
      { name: "description", content: "View and manage all platform payments." },
    ],
  }),
  component: AdminPaymentsPage,
});

const payments = [
  { id: "PAY-0412", client: "Mohammed Al-Rashid", description: "Work Visa Application Fee", amount: "$350", method: "Card", status: "completed", date: "2026-04-15" },
  { id: "PAY-0411", client: "Priya Sharma", description: "Study Visa Application Fee", amount: "$280", method: "Bank Transfer", status: "completed", date: "2026-04-14" },
  { id: "PAY-0410", client: "David Chen", description: "Work Visa Application Fee", amount: "$400", method: "Card", status: "completed", date: "2026-04-13" },
  { id: "PAY-0409", client: "Fatima Zahra", description: "Study Visa Application Fee", amount: "$250", method: "Card", status: "pending", date: "2026-04-12" },
  { id: "PAY-0408", client: "James Okonkwo", description: "Work Visa Application Fee", amount: "$350", method: "Card", status: "completed", date: "2026-04-11" },
  { id: "PAY-0407", client: "Ana Garcia", description: "Visit Visa Application Fee", amount: "$200", method: "PayPal", status: "failed", date: "2026-04-10" },
  { id: "PAY-0406", client: "Yuki Tanaka", description: "Premium Processing", amount: "$500", method: "Card", status: "completed", date: "2026-04-09" },
  { id: "PAY-0405", client: "Pierre Dubois", description: "Agent Commission Payout", amount: "-$120", method: "Bank Transfer", status: "completed", date: "2026-04-08" },
];

function AdminPaymentsPage() {
  const [search, setSearch] = useState("");
  const filtered = payments.filter(
    (p) =>
      p.client.toLowerCase().includes(search.toLowerCase()) ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader title="Payments" />
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mb-6 grid gap-4 sm:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                    <DollarSign className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">$124,800</p>
                    <p className="text-sm text-muted-foreground">Total Revenue</p>
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
                    <p className="text-2xl font-bold">$18,400</p>
                    <p className="text-sm text-muted-foreground">This Month</p>
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
                    <p className="text-2xl font-bold">$2,450</p>
                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">96.2%</p>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle className="text-lg">Transaction History</CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search payments..." className="w-48 pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <Button variant="outline"><Download className="mr-2 h-4 w-4" />Export</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-3 pr-4 font-medium">ID</th>
                      <th className="pb-3 pr-4 font-medium">Client</th>
                      <th className="pb-3 pr-4 font-medium hidden sm:table-cell">Description</th>
                      <th className="pb-3 pr-4 font-medium">Amount</th>
                      <th className="pb-3 pr-4 font-medium hidden md:table-cell">Method</th>
                      <th className="pb-3 pr-4 font-medium">Status</th>
                      <th className="pb-3 font-medium hidden lg:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p) => (
                      <tr key={p.id} className="border-b border-border/50 last:border-0">
                        <td className="py-3 pr-4 font-medium text-primary">{p.id}</td>
                        <td className="py-3 pr-4">{p.client}</td>
                        <td className="py-3 pr-4 hidden sm:table-cell text-muted-foreground">{p.description}</td>
                        <td className="py-3 pr-4 font-medium">{p.amount}</td>
                        <td className="py-3 pr-4 hidden md:table-cell">{p.method}</td>
                        <td className="py-3 pr-4">
                          <Badge variant={p.status === "completed" ? "default" : p.status === "pending" ? "secondary" : "destructive"}>{p.status}</Badge>
                        </td>
                        <td className="py-3 hidden lg:table-cell text-muted-foreground">{p.date}</td>
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
