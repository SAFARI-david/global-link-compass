import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Plus, Eye, Edit, Trash2 } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/programs")({
  head: () => ({
    meta: [
      { title: "Manage Programs — Admin" },
      { name: "description", content: "Create, edit, and manage study programs." },
    ],
  }),
  component: AdminProgramsPage,
});

const programs = [
  { id: "1", name: "MSc Computer Science", institution: "University of Toronto", country: "Canada", level: "Master's", tuition: "$28,000/yr", scholarships: true, applications: 45, status: "active" },
  { id: "2", name: "MBA International Business", institution: "London Business School", country: "UK", level: "Master's", tuition: "£45,000/yr", scholarships: true, applications: 38, status: "active" },
  { id: "3", name: "Bachelor of Engineering", institution: "TU Munich", country: "Germany", level: "Bachelor's", tuition: "€500/sem", scholarships: true, applications: 67, status: "active" },
  { id: "4", name: "Diploma in Nursing", institution: "TAFE NSW", country: "Australia", level: "Diploma", tuition: "A$18,000/yr", scholarships: false, applications: 22, status: "active" },
  { id: "5", name: "PhD Data Science", institution: "ETH Zurich", country: "Switzerland", level: "PhD", tuition: "CHF 1,200/sem", scholarships: true, applications: 14, status: "paused" },
  { id: "6", name: "Foundation Year", institution: "Dublin City University", country: "Ireland", level: "Foundation", tuition: "€12,000/yr", scholarships: false, applications: 9, status: "closed" },
];

function AdminProgramsPage() {
  const [search, setSearch] = useState("");
  const filtered = programs.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.institution.toLowerCase().includes(search.toLowerCase()) ||
      p.country.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader title="Study Programs" />
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mb-6 grid gap-4 sm:grid-cols-4">
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">89</p><p className="text-sm text-muted-foreground">Total Programs</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-600">74</p><p className="text-sm text-muted-foreground">Active</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">42</p><p className="text-sm text-muted-foreground">With Scholarships</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">523</p><p className="text-sm text-muted-foreground">Total Applications</p></CardContent></Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle className="text-lg">All Programs</CardTitle>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search programs..." className="w-48 pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <Button variant="gold"><Plus className="mr-2 h-4 w-4" />Add Program</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-3 pr-4 font-medium">Program</th>
                      <th className="pb-3 pr-4 font-medium hidden sm:table-cell">Institution</th>
                      <th className="pb-3 pr-4 font-medium hidden md:table-cell">Country</th>
                      <th className="pb-3 pr-4 font-medium hidden lg:table-cell">Level</th>
                      <th className="pb-3 pr-4 font-medium hidden lg:table-cell">Tuition</th>
                      <th className="pb-3 pr-4 font-medium">Apps</th>
                      <th className="pb-3 pr-4 font-medium">Status</th>
                      <th className="pb-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((p) => (
                      <tr key={p.id} className="border-b border-border/50 last:border-0">
                        <td className="py-3 pr-4">
                          <p className="font-medium">{p.name}</p>
                          {p.scholarships && <span className="text-xs text-gold">Scholarships available</span>}
                        </td>
                        <td className="py-3 pr-4 hidden sm:table-cell">{p.institution}</td>
                        <td className="py-3 pr-4 hidden md:table-cell">{p.country}</td>
                        <td className="py-3 pr-4 hidden lg:table-cell">{p.level}</td>
                        <td className="py-3 pr-4 hidden lg:table-cell">{p.tuition}</td>
                        <td className="py-3 pr-4">{p.applications}</td>
                        <td className="py-3 pr-4">
                          <Badge variant={p.status === "active" ? "default" : p.status === "paused" ? "secondary" : "destructive"}>{p.status}</Badge>
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
