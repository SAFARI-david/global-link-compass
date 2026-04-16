import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/jobs")({
  head: () => ({
    meta: [
      { title: "Manage Jobs — Admin" },
      { name: "description", content: "Create, edit, and manage job listings." },
    ],
  }),
  component: AdminJobsPage,
});

const jobs = [
  { id: "1", title: "Software Engineer", company: "TechCorp GmbH", country: "Germany", category: "Technology", visa: true, applications: 34, status: "active", posted: "2026-04-01" },
  { id: "2", title: "Registered Nurse", company: "NHS Trust", country: "UK", category: "Healthcare", visa: true, applications: 56, status: "active", posted: "2026-03-28" },
  { id: "3", title: "Farm Worker", company: "AgriCo NZ", country: "New Zealand", category: "Agriculture", visa: true, applications: 12, status: "active", posted: "2026-03-25" },
  { id: "4", title: "Accountant", company: "PwC Canada", country: "Canada", category: "Finance", visa: true, applications: 28, status: "active", posted: "2026-03-20" },
  { id: "5", title: "Chef", company: "Hilton Hotels", country: "UAE", category: "Hospitality", visa: true, applications: 19, status: "paused", posted: "2026-03-15" },
  { id: "6", title: "Civil Engineer", company: "Bouygues", country: "France", category: "Engineering", visa: false, applications: 8, status: "closed", posted: "2026-02-10" },
];

function AdminJobsPage() {
  const [search, setSearch] = useState("");
  const filtered = jobs.filter(
    (j) =>
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader title="Jobs" />
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mb-6 grid gap-4 sm:grid-cols-4">
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">156</p><p className="text-sm text-muted-foreground">Total Jobs</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-600">128</p><p className="text-sm text-muted-foreground">Active</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-amber-600">15</p><p className="text-sm text-muted-foreground">Paused</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">892</p><p className="text-sm text-muted-foreground">Total Applications</p></CardContent></Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle className="text-lg">All Jobs</CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search jobs..." className="w-48 pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <Button variant="gold"><Plus className="mr-2 h-4 w-4" />Add Job</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-3 pr-4 font-medium">Title</th>
                      <th className="pb-3 pr-4 font-medium hidden sm:table-cell">Company</th>
                      <th className="pb-3 pr-4 font-medium hidden md:table-cell">Country</th>
                      <th className="pb-3 pr-4 font-medium hidden lg:table-cell">Visa</th>
                      <th className="pb-3 pr-4 font-medium">Apps</th>
                      <th className="pb-3 pr-4 font-medium">Status</th>
                      <th className="pb-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((j) => (
                      <tr key={j.id} className="border-b border-border/50 last:border-0">
                        <td className="py-3 pr-4">
                          <p className="font-medium">{j.title}</p>
                          <p className="text-xs text-muted-foreground">{j.category}</p>
                        </td>
                        <td className="py-3 pr-4 hidden sm:table-cell">{j.company}</td>
                        <td className="py-3 pr-4 hidden md:table-cell">{j.country}</td>
                        <td className="py-3 pr-4 hidden lg:table-cell">
                          {j.visa ? <Badge variant="default">Yes</Badge> : <Badge variant="secondary">No</Badge>}
                        </td>
                        <td className="py-3 pr-4">{j.applications}</td>
                        <td className="py-3 pr-4">
                          <Badge variant={j.status === "active" ? "default" : j.status === "paused" ? "secondary" : "destructive"}>{j.status}</Badge>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><Edit className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive"><Trash2 className="h-4 w-4" /></Button>
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
