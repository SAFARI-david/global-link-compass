import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Eye, ArrowUpDown } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/agent/StatusBadge";

export const Route = createFileRoute("/admin/applications")({
  head: () => ({
    meta: [
      { title: "Manage Applications — Admin" },
      { name: "description", content: "View and manage all visa and study applications." },
    ],
  }),
  component: AdminApplicationsPage,
});

const applications = [
  { id: "APP-2026-0412", applicant: "Mohammed Al-Rashid", type: "Work Visa", country: "Canada", agent: "Sarah Miller", status: "under_review", submitted: "2026-04-15", fee: "$350" },
  { id: "APP-2026-0411", applicant: "Priya Sharma", type: "Study Visa", country: "UK", agent: "John Smith", status: "pending_documents", submitted: "2026-04-14", fee: "$280" },
  { id: "APP-2026-0410", applicant: "David Chen", type: "Work Visa", country: "Australia", agent: "Sarah Miller", status: "approved", submitted: "2026-04-13", fee: "$400" },
  { id: "APP-2026-0409", applicant: "Fatima Zahra", type: "Study Visa", country: "Germany", agent: "—", status: "submitted", submitted: "2026-04-12", fee: "$250" },
  { id: "APP-2026-0408", applicant: "James Okonkwo", type: "Work Visa", country: "Canada", agent: "Maria Lopez", status: "in_progress", submitted: "2026-04-11", fee: "$350" },
  { id: "APP-2026-0407", applicant: "Ana Garcia", type: "Visit Visa", country: "USA", agent: "—", status: "submitted", submitted: "2026-04-10", fee: "$200" },
  { id: "APP-2026-0406", applicant: "Yuki Tanaka", type: "Work Visa", country: "Germany", agent: "John Smith", status: "approved", submitted: "2026-04-09", fee: "$380" },
  { id: "APP-2026-0405", applicant: "Pierre Dubois", type: "Study Visa", country: "Canada", agent: "Maria Lopez", status: "rejected", submitted: "2026-04-08", fee: "$280" },
];

function AdminApplicationsPage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const filtered = applications.filter((a) => {
    const matchesSearch = a.applicant.toLowerCase().includes(search.toLowerCase()) || a.id.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "all" || a.type === typeFilter;
    const matchesStatus = statusFilter === "all" || a.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader title="Applications" />
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mb-6 grid gap-4 sm:grid-cols-5">
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">847</p><p className="text-sm text-muted-foreground">Total</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-amber-600">124</p><p className="text-sm text-muted-foreground">Pending</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-blue-600">289</p><p className="text-sm text-muted-foreground">In Progress</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-600">398</p><p className="text-sm text-muted-foreground">Approved</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-destructive">36</p><p className="text-sm text-muted-foreground">Rejected</p></CardContent></Card>
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
                  <select className="rounded-md border border-input bg-background px-3 py-2 text-sm" value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                    <option value="all">All Types</option>
                    <option value="Work Visa">Work Visa</option>
                    <option value="Study Visa">Study Visa</option>
                    <option value="Visit Visa">Visit Visa</option>
                  </select>
                  <select className="rounded-md border border-input bg-background px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="all">All Status</option>
                    <option value="submitted">Submitted</option>
                    <option value="under_review">Under Review</option>
                    <option value="in_progress">In Progress</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-3 pr-4 font-medium">ID</th>
                      <th className="pb-3 pr-4 font-medium">Applicant</th>
                      <th className="pb-3 pr-4 font-medium hidden sm:table-cell">Type</th>
                      <th className="pb-3 pr-4 font-medium hidden md:table-cell">Country</th>
                      <th className="pb-3 pr-4 font-medium hidden lg:table-cell">Agent</th>
                      <th className="pb-3 pr-4 font-medium">Status</th>
                      <th className="pb-3 pr-4 font-medium hidden xl:table-cell">Fee</th>
                      <th className="pb-3 font-medium hidden xl:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((a) => (
                      <tr key={a.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 cursor-pointer">
                        <td className="py-3 pr-4 font-medium text-primary">{a.id}</td>
                        <td className="py-3 pr-4">{a.applicant}</td>
                        <td className="py-3 pr-4 hidden sm:table-cell">{a.type}</td>
                        <td className="py-3 pr-4 hidden md:table-cell">{a.country}</td>
                        <td className="py-3 pr-4 hidden lg:table-cell">{a.agent}</td>
                        <td className="py-3 pr-4"><StatusBadge status={a.status} /></td>
                        <td className="py-3 pr-4 hidden xl:table-cell">{a.fee}</td>
                        <td className="py-3 hidden xl:table-cell text-muted-foreground">{a.submitted}</td>
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
