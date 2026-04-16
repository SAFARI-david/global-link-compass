import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Filter, MoreHorizontal, Eye, Mail, Ban } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/applicants")({
  head: () => ({
    meta: [
      { title: "Manage Applicants — Admin" },
      { name: "description", content: "View and manage all applicants." },
    ],
  }),
  component: AdminApplicantsPage,
});

const applicants = [
  { id: "1", name: "Mohammed Al-Rashid", email: "mohammed@email.com", nationality: "Saudi Arabia", applications: 2, status: "active", joined: "2026-03-10" },
  { id: "2", name: "Priya Sharma", email: "priya@email.com", nationality: "India", applications: 1, status: "active", joined: "2026-03-14" },
  { id: "3", name: "David Chen", email: "david@email.com", nationality: "China", applications: 3, status: "active", joined: "2026-02-20" },
  { id: "4", name: "Fatima Zahra", email: "fatima@email.com", nationality: "Morocco", applications: 1, status: "suspended", joined: "2026-01-15" },
  { id: "5", name: "James Okonkwo", email: "james@email.com", nationality: "Nigeria", applications: 2, status: "active", joined: "2026-04-01" },
  { id: "6", name: "Ana Garcia", email: "ana@email.com", nationality: "Mexico", applications: 1, status: "active", joined: "2026-04-05" },
  { id: "7", name: "Yuki Tanaka", email: "yuki@email.com", nationality: "Japan", applications: 4, status: "active", joined: "2026-01-28" },
  { id: "8", name: "Pierre Dubois", email: "pierre@email.com", nationality: "France", applications: 1, status: "inactive", joined: "2025-11-12" },
];

function AdminApplicantsPage() {
  const [search, setSearch] = useState("");
  const filtered = applicants.filter(
    (a) =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.nationality.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader title="Applicants" />
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Stats row */}
          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">1,284</p><p className="text-sm text-muted-foreground">Total Applicants</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">1,198</p><p className="text-sm text-muted-foreground">Active</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">48</p><p className="text-sm text-muted-foreground">New This Week</p></CardContent></Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle className="text-lg">All Applicants</CardTitle>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search applicants..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-3 pr-4 font-medium">Name</th>
                      <th className="pb-3 pr-4 font-medium hidden sm:table-cell">Email</th>
                      <th className="pb-3 pr-4 font-medium hidden md:table-cell">Nationality</th>
                      <th className="pb-3 pr-4 font-medium">Apps</th>
                      <th className="pb-3 pr-4 font-medium">Status</th>
                      <th className="pb-3 pr-4 font-medium hidden lg:table-cell">Joined</th>
                      <th className="pb-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((a) => (
                      <tr key={a.id} className="border-b border-border/50 last:border-0">
                        <td className="py-3 pr-4 font-medium">{a.name}</td>
                        <td className="py-3 pr-4 hidden sm:table-cell text-muted-foreground">{a.email}</td>
                        <td className="py-3 pr-4 hidden md:table-cell">{a.nationality}</td>
                        <td className="py-3 pr-4">{a.applications}</td>
                        <td className="py-3 pr-4">
                          <Badge variant={a.status === "active" ? "default" : a.status === "suspended" ? "destructive" : "secondary"}>
                            {a.status}
                          </Badge>
                        </td>
                        <td className="py-3 pr-4 hidden lg:table-cell text-muted-foreground">{a.joined}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8"><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8"><Mail className="h-4 w-4" /></Button>
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
