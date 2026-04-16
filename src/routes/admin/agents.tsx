import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Eye, CheckCircle, XCircle } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/agents")({
  head: () => ({
    meta: [
      { title: "Manage Agents — Admin" },
      { name: "description", content: "View, approve, and manage agents." },
    ],
  }),
  component: AdminAgentsPage,
});

const agents = [
  { id: "1", name: "Sarah Miller", email: "sarah@agency.com", company: "Visa Experts Ltd", clients: 24, applications: 67, status: "approved", revenue: "$12,400", joined: "2025-06-15" },
  { id: "2", name: "John Smith", email: "john@visas.com", company: "Smith Immigration", clients: 18, applications: 43, status: "approved", revenue: "$8,900", joined: "2025-08-22" },
  { id: "3", name: "Maria Lopez", email: "maria@global.com", company: "Global Consultants", clients: 31, applications: 89, status: "approved", revenue: "$18,200", joined: "2025-04-10" },
  { id: "4", name: "Ahmed Hassan", email: "ahmed@migrate.com", company: "MigrateNow", clients: 0, applications: 0, status: "pending", revenue: "$0", joined: "2026-04-14" },
  { id: "5", name: "Lisa Wang", email: "lisa@pathways.com", company: "Pathways Immigration", clients: 0, applications: 0, status: "pending", revenue: "$0", joined: "2026-04-15" },
  { id: "6", name: "Robert Brown", email: "robert@old.com", company: "Brown & Co", clients: 5, applications: 12, status: "suspended", revenue: "$2,100", joined: "2025-01-20" },
];

function AdminAgentsPage() {
  const [search, setSearch] = useState("");
  const filtered = agents.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader title="Agents" />
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mb-6 grid gap-4 sm:grid-cols-4">
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">36</p><p className="text-sm text-muted-foreground">Total Agents</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">33</p><p className="text-sm text-muted-foreground">Approved</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-amber-600">3</p><p className="text-sm text-muted-foreground">Pending Approval</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">$124,800</p><p className="text-sm text-muted-foreground">Total Revenue</p></CardContent></Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle className="text-lg">All Agents</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search agents..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-3 pr-4 font-medium">Name</th>
                      <th className="pb-3 pr-4 font-medium hidden sm:table-cell">Company</th>
                      <th className="pb-3 pr-4 font-medium hidden md:table-cell">Clients</th>
                      <th className="pb-3 pr-4 font-medium hidden md:table-cell">Apps</th>
                      <th className="pb-3 pr-4 font-medium hidden lg:table-cell">Revenue</th>
                      <th className="pb-3 pr-4 font-medium">Status</th>
                      <th className="pb-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((a) => (
                      <tr key={a.id} className="border-b border-border/50 last:border-0">
                        <td className="py-3 pr-4">
                          <div>
                            <p className="font-medium">{a.name}</p>
                            <p className="text-xs text-muted-foreground">{a.email}</p>
                          </div>
                        </td>
                        <td className="py-3 pr-4 hidden sm:table-cell">{a.company}</td>
                        <td className="py-3 pr-4 hidden md:table-cell">{a.clients}</td>
                        <td className="py-3 pr-4 hidden md:table-cell">{a.applications}</td>
                        <td className="py-3 pr-4 hidden lg:table-cell">{a.revenue}</td>
                        <td className="py-3 pr-4">
                          <Badge variant={a.status === "approved" ? "default" : a.status === "pending" ? "secondary" : "destructive"}>
                            {a.status}
                          </Badge>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                            {a.status === "pending" && (
                              <>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600"><CheckCircle className="h-4 w-4" /></Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><XCircle className="h-4 w-4" /></Button>
                              </>
                            )}
                          </div>
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
