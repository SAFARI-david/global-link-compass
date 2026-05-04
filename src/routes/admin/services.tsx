import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Eye, Star, Flame, MoreHorizontal, Search, ArrowUpDown } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ServiceForm } from "@/components/admin/ServiceForm";

export const Route = createFileRoute("/admin/services")({
  head: () => ({
    meta: [
      { title: "Manage Services — Admin" },
      { name: "description", content: "Create, edit, and manage immigration services and pricing." },
    ],
  }),
  component: AdminServicesPage,
});

function AdminServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "form">("list");
  const [statusFilter, setStatusFilter] = useState("all");
  const [editService, setEditService] = useState<any>(null);
  const [sortBy, setSortBy] = useState("updated");

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from("services")
      .select("*")
      .order("created_at", { ascending: false });
    setServices(data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function deleteService(id: string) {
    if (!confirm("Delete this service?")) return;
    const { error } = await supabase.from("services").delete().eq("id", id);
    if (error) { toast.error("Failed to delete"); return; }
    toast.success("Service deleted");
    load();
  }

  const filtered = services.filter((s) => {
    if (statusFilter !== "all") {
      const isActive = s.status === "active";
      if (statusFilter === "active" && !isActive) return false;
      if (statusFilter === "inactive" && isActive) return false;
    }
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (s.name && s.name.toLowerCase().includes(q)) ||
      (s.slug && s.slug.toLowerCase().includes(q)) ||
      s.country.toLowerCase().includes(q) ||
      s.visa_type.toLowerCase().includes(q)
    );
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "name") {
      const nameA = (a.name || a.country || "").toLowerCase();
      const nameB = (b.name || b.country || "").toLowerCase();
      return nameA.localeCompare(nameB);
    }
    const dateA = new Date(a.updated_at || a.created_at).getTime();
    const dateB = new Date(b.updated_at || b.created_at).getTime();
    return dateB - dateA;
  });

  const stats = {
    total: services.length,
    active: services.filter((s) => s.status === "active").length,
    featured: services.filter((s) => s.is_featured).length,
    hotDeals: services.filter((s) => s.is_hot_deal).length,
  };

  if (view === "form") {
    return (
      <div className="flex min-h-screen bg-surface">
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          <AdminHeader title={editService ? "Edit Service" : "Add Service"} />
          <div className="flex-1 overflow-y-auto p-4 lg:p-6">
            <ServiceForm
              service={editService}
              onSuccess={() => {
                setView("list");
                setEditService(null);
                load();
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader title="Services Management" />
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Stats */}
          <div className="mb-6 grid gap-4 sm:grid-cols-4">
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold">{stats.total}</p><p className="text-sm text-muted-foreground">Total Services</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-primary">{stats.active}</p><p className="text-sm text-muted-foreground">Active</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-gold">{stats.featured}</p><p className="text-sm text-muted-foreground">Featured</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-destructive">{stats.hotDeals}</p><p className="text-sm text-muted-foreground">🔥 Hot Deals</p></CardContent></Card>
          </div>

          {/* Table */}
          <Card>
            <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-lg">All Services</CardTitle>
              <div className="flex items-center gap-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="updated">Last Updated</SelectItem>
                    <SelectItem value="name">Name (A–Z)</SelectItem>
                  </SelectContent>
                </Select>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search…" className="w-48 pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <Button variant="gold" onClick={() => { setEditService(null); setView("form"); }}>
                  <Plus className="mr-2 h-4 w-4" /> Add Service
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-8"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
              ) : sorted.length === 0 ? (
                <p className="py-8 text-center text-sm text-muted-foreground">No services found. Add your first service.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-muted-foreground">
                        <th className="pb-3 pr-4 font-medium">Service</th>
                        <th className="pb-3 pr-4 font-medium hidden sm:table-cell">Slug</th>
                        <th className="pb-3 pr-4 font-medium hidden md:table-cell">Country / Visa</th>
                        <th className="pb-3 pr-4 font-medium hidden md:table-cell">Price</th>
                        <th className="pb-3 pr-4 font-medium hidden lg:table-cell">Processing</th>
                        <th className="pb-3 pr-4 font-medium">Status</th>
                        <th className="pb-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sorted.map((s) => (
                        <tr key={s.id} className="border-b border-border/50 last:border-0">
                          <td className="py-3 pr-4">
                            <p className="font-medium">{s.name || `${s.country} — ${s.visa_type}`}</p>
                            <div className="flex gap-1 mt-0.5">
                              {s.is_featured && <Badge variant="secondary" className="text-[10px]">★ Featured</Badge>}
                              {s.is_hot_deal && <Badge variant="destructive" className="text-[10px]">🔥 Hot</Badge>}
                            </div>
                          </td>
                          <td className="py-3 pr-4 hidden sm:table-cell text-muted-foreground text-xs font-mono">{s.slug || "—"}</td>
                          <td className="py-3 pr-4 hidden md:table-cell">
                            <span>{s.country}</span>
                            <span className="text-muted-foreground"> / {s.visa_type}</span>
                          </td>
                          <td className="py-3 pr-4 hidden md:table-cell font-semibold">
                            ${Number(s.standard_price).toFixed(0)}
                            {s.partner_price && <span className="text-xs text-muted-foreground font-normal ml-1">(P: ${Number(s.partner_price).toFixed(0)})</span>}
                          </td>
                          <td className="py-3 pr-4 hidden lg:table-cell text-muted-foreground">{s.processing_time || "—"}</td>
                          <td className="py-3 pr-4">
                            <Badge variant={s.status === "active" ? "default" : s.status === "draft" ? "secondary" : "outline"}>
                              {s.status || (s.is_active ? "active" : "inactive")}
                            </Badge>
                          </td>
                          <td className="py-3">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => { setEditService(s); setView("form"); }}>
                                  <Edit className="mr-2 h-4 w-4" /> Edit
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-destructive" onClick={() => deleteService(s.id)}>
                                  <Trash2 className="mr-2 h-4 w-4" /> Delete
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
