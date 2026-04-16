import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Search, Plus, Eye, Edit, Trash2, Copy, Star, StarOff,
  Filter, Globe, FileText, Clock, DollarSign, MoreHorizontal,
} from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/programs")({
  head: () => ({
    meta: [
      { title: "Manage Programs — Admin" },
      { name: "description", content: "Create, edit, and manage immigration programs." },
    ],
  }),
  component: AdminProgramsPage,
});

type Program = {
  id: string;
  name: string;
  slug: string;
  country: string;
  visa_type: string;
  category: string | null;
  processing_time: string | null;
  service_fee: number | null;
  currency: string | null;
  status: string;
  featured: boolean;
  updated_at: string;
};

function AdminProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState("all");
  const [visaFilter, setVisaFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchPrograms = async () => {
    const { data, error } = await supabase
      .from("programs")
      .select("id, name, slug, country, visa_type, category, processing_time, service_fee, currency, status, featured, updated_at")
      .order("country")
      .order("visa_type")
      .order("name");
    if (error) {
      toast.error("Failed to load programs");
      return;
    }
    setPrograms(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchPrograms(); }, []);

  const countries = [...new Set(programs.map((p) => p.country))];
  const visaTypes = [...new Set(programs.map((p) => p.visa_type))];

  const filtered = programs.filter((p) => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase()) && !p.country.toLowerCase().includes(search.toLowerCase())) return false;
    if (countryFilter !== "all" && p.country !== countryFilter) return false;
    if (visaFilter !== "all" && p.visa_type !== visaFilter) return false;
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    return true;
  });

  const stats = {
    total: programs.length,
    active: programs.filter((p) => p.status === "active").length,
    featured: programs.filter((p) => p.featured).length,
    draft: programs.filter((p) => p.status === "draft").length,
  };

  const toggleFeatured = async (id: string, current: boolean) => {
    const { error } = await supabase.from("programs").update({ featured: !current }).eq("id", id);
    if (error) { toast.error("Failed to update"); return; }
    toast.success(current ? "Unfeatured" : "Featured");
    fetchPrograms();
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("programs").update({ status }).eq("id", id);
    if (error) { toast.error("Failed to update status"); return; }
    toast.success(`Status changed to ${status}`);
    fetchPrograms();
  };

  const duplicateProgram = async (id: string) => {
    const { data: original } = await supabase.from("programs").select("*").eq("id", id).single();
    if (!original) return;
    const { id: _id, created_at, updated_at, slug, ...rest } = original;
    const { error } = await supabase.from("programs").insert({
      ...rest,
      name: `${rest.name} (Copy)`,
      slug: `${slug}-copy-${Date.now()}`,
      status: "draft",
    });
    if (error) { toast.error("Failed to duplicate"); return; }
    toast.success("Program duplicated as draft");
    fetchPrograms();
  };

  const deleteProgram = async (id: string) => {
    if (!confirm("Are you sure you want to delete this program?")) return;
    const { error } = await supabase.from("programs").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    toast.success("Program deleted");
    fetchPrograms();
  };

  const statusColor = (s: string) => {
    if (s === "active") return "default" as const;
    if (s === "draft") return "secondary" as const;
    if (s === "paused") return "outline" as const;
    return "destructive" as const;
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader title="Immigration Programs" />
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Stats */}
          <div className="mb-6 grid gap-4 sm:grid-cols-4">
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{stats.total}</p><p className="text-sm text-muted-foreground">Total Programs</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-green-600">{stats.active}</p><p className="text-sm text-muted-foreground">Active</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-gold">{stats.featured}</p><p className="text-sm text-muted-foreground">Featured</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-muted-foreground">{stats.draft}</p><p className="text-sm text-muted-foreground">Drafts</p></CardContent></Card>
          </div>

          {/* Table */}
          <Card>
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-lg">All Programs</CardTitle>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search..." className="w-44 pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <Select value={countryFilter} onValueChange={setCountryFilter}>
                  <SelectTrigger className="w-36"><Filter className="mr-1 h-3 w-3" /><SelectValue placeholder="Country" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {countries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={visaFilter} onValueChange={setVisaFilter}>
                  <SelectTrigger className="w-36"><SelectValue placeholder="Visa Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Visa Types</SelectItem>
                    {visaTypes.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
                  </SelectContent>
                </Select>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-28"><SelectValue placeholder="Status" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="paused">Paused</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
                <Link to="/admin/programs/new">
                  <Button variant="gold"><Plus className="mr-2 h-4 w-4" />Add Program</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="py-8 text-center text-muted-foreground">Loading programs...</p>
              ) : filtered.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground">No programs found.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-muted-foreground">
                        <th className="pb-3 pr-4 font-medium">Program</th>
                        <th className="pb-3 pr-4 font-medium hidden sm:table-cell">Country</th>
                        <th className="pb-3 pr-4 font-medium hidden md:table-cell">Visa Type</th>
                        <th className="pb-3 pr-4 font-medium hidden lg:table-cell">Category</th>
                        <th className="pb-3 pr-4 font-medium hidden lg:table-cell">Processing</th>
                        <th className="pb-3 pr-4 font-medium hidden lg:table-cell">Fee</th>
                        <th className="pb-3 pr-4 font-medium">Status</th>
                        <th className="pb-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((p) => (
                        <tr key={p.id} className="border-b border-border/50 last:border-0">
                          <td className="py-3 pr-4">
                            <p className="font-medium">{p.name}</p>
                            {p.featured && <span className="text-xs text-gold">★ Featured</span>}
                          </td>
                          <td className="py-3 pr-4 hidden sm:table-cell">{p.country}</td>
                          <td className="py-3 pr-4 hidden md:table-cell">{p.visa_type}</td>
                          <td className="py-3 pr-4 hidden lg:table-cell">{p.category || "—"}</td>
                          <td className="py-3 pr-4 hidden lg:table-cell">{p.processing_time || "—"}</td>
                          <td className="py-3 pr-4 hidden lg:table-cell">
                            {p.service_fee ? `${p.currency} ${p.service_fee.toLocaleString()}` : "—"}
                          </td>
                          <td className="py-3 pr-4">
                            <Badge variant={statusColor(p.status)}>{p.status}</Badge>
                          </td>
                          <td className="py-3">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link to={`/services/${p.slug}`} target="_blank">
                                    <Eye className="mr-2 h-4 w-4" />Preview
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                  <Link to="/admin/programs/edit" search={{ id: p.id }}>
                                    <Edit className="mr-2 h-4 w-4" />Edit
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => duplicateProgram(p.id)}>
                                  <Copy className="mr-2 h-4 w-4" />Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => toggleFeatured(p.id, p.featured)}>
                                  {p.featured ? <StarOff className="mr-2 h-4 w-4" /> : <Star className="mr-2 h-4 w-4" />}
                                  {p.featured ? "Unfeature" : "Feature"}
                                </DropdownMenuItem>
                                {p.status !== "active" && (
                                  <DropdownMenuItem onClick={() => updateStatus(p.id, "active")}>Activate</DropdownMenuItem>
                                )}
                                {p.status !== "paused" && (
                                  <DropdownMenuItem onClick={() => updateStatus(p.id, "paused")}>Pause</DropdownMenuItem>
                                )}
                                {p.status !== "archived" && (
                                  <DropdownMenuItem onClick={() => updateStatus(p.id, "archived")}>Archive</DropdownMenuItem>
                                )}
                                <DropdownMenuItem className="text-destructive" onClick={() => deleteProgram(p.id)}>
                                  <Trash2 className="mr-2 h-4 w-4" />Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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
