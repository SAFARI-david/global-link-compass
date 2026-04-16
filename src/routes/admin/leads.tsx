import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, RefreshCw, Users, TrendingUp, Target, CheckCircle, Download } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/leads")({
  head: () => ({ meta: [{ title: "Leads — Admin" }] }),
  component: AdminLeadsPage,
});

const sourceLabels: Record<string, string> = {
  "canada-work": "Canada Work Visa",
  study: "Study Abroad",
  jobs: "Jobs",
};

function AdminLeadsPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");

  useEffect(() => { load(); }, [sourceFilter]);

  async function load() {
    setLoading(true);
    try {
      let q = supabase.from("leads").select("*").order("created_at", { ascending: false });
      if (sourceFilter !== "all") q = q.eq("source", sourceFilter);
      const { data, error } = await q;
      if (error) throw error;
      setLeads(data || []);
    } catch {
      toast.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  }

  async function toggleConverted(id: string, current: boolean) {
    try {
      const { error } = await supabase.from("leads").update({ converted: !current } as any).eq("id", id);
      if (error) throw error;
      toast.success(current ? "Marked as unconverted" : "Marked as converted");
      load();
    } catch {
      toast.error("Failed to update");
    }
  }

  function exportToCSV() {
    const headers = ["Name", "Email", "Source", "UTM Source", "UTM Medium", "UTM Campaign", "Status", "Converted", "Date", "Form Data"];
    const rows = filtered.map((l) => [
      l.name,
      l.email,
      sourceLabels[l.source] || l.source,
      l.utm_source || "",
      l.utm_medium || "",
      l.utm_campaign || "",
      l.converted ? "Converted" : "New",
      l.converted ? "Yes" : "No",
      new Date(l.created_at).toLocaleDateString(),
      JSON.stringify(l.form_data || {}),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `leads-export-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    toast.success(`Exported ${filtered.length} leads to CSV`);
  }

  const filtered = leads.filter(
    (l) =>
      l.name?.toLowerCase().includes(search.toLowerCase()) ||
      l.email?.toLowerCase().includes(search.toLowerCase()),
  );

  const stats = {
    total: leads.length,
    today: leads.filter((l) => new Date(l.created_at).toDateString() === new Date().toDateString()).length,
    converted: leads.filter((l) => l.converted).length,
    conversionRate: leads.length > 0 ? Math.round((leads.filter((l) => l.converted).length / leads.length) * 100) : 0,
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader title="Leads" />
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Stats */}
          <div className="mb-6 grid gap-4 sm:grid-cols-4">
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary"><Users className="h-5 w-5" /></div><div><p className="text-2xl font-bold">{stats.total}</p><p className="text-sm text-muted-foreground">Total Leads</p></div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600"><TrendingUp className="h-5 w-5" /></div><div><p className="text-2xl font-bold">{stats.today}</p><p className="text-sm text-muted-foreground">Today</p></div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600"><CheckCircle className="h-5 w-5" /></div><div><p className="text-2xl font-bold">{stats.converted}</p><p className="text-sm text-muted-foreground">Converted</p></div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600"><Target className="h-5 w-5" /></div><div><p className="text-2xl font-bold">{stats.conversionRate}%</p><p className="text-sm text-muted-foreground">Conversion Rate</p></div></div></CardContent></Card>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <CardTitle className="text-lg">Lead Submissions</CardTitle>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={exportToCSV} className="gap-2">
                  <Download className="h-4 w-4" />
                  Export CSV
                </Button>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input placeholder="Search name or email…" className="w-52 pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="canada-work">Canada Work</SelectItem>
                    <SelectItem value="study">Study</SelectItem>
                    <SelectItem value="jobs">Jobs</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={load}><RefreshCw className="h-4 w-4" /></Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>
              ) : filtered.length === 0 ? (
                <div className="py-12 text-center text-sm text-muted-foreground">No leads yet. Leads are captured from landing page form submissions.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-muted-foreground">
                        <th className="pb-3 pr-4 font-medium">Name</th>
                        <th className="pb-3 pr-4 font-medium">Email</th>
                        <th className="pb-3 pr-4 font-medium">Source</th>
                        <th className="pb-3 pr-4 font-medium hidden sm:table-cell">UTM</th>
                        <th className="pb-3 pr-4 font-medium">Status</th>
                        <th className="pb-3 pr-4 font-medium hidden md:table-cell">Date</th>
                        <th className="pb-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((l) => (
                        <tr key={l.id} className="border-b border-border/50 last:border-0">
                          <td className="py-3 pr-4 font-medium">{l.name}</td>
                          <td className="py-3 pr-4 text-primary">{l.email}</td>
                          <td className="py-3 pr-4">
                            <Badge variant="secondary" className="text-xs">{sourceLabels[l.source] || l.source}</Badge>
                          </td>
                          <td className="py-3 pr-4 hidden sm:table-cell text-xs text-muted-foreground">
                            {l.utm_campaign || l.utm_source || "—"}
                          </td>
                          <td className="py-3 pr-4">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${l.converted ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                              {l.converted ? "Converted" : "New"}
                            </span>
                          </td>
                          <td className="py-3 pr-4 hidden md:table-cell text-muted-foreground">{new Date(l.created_at).toLocaleDateString()}</td>
                          <td className="py-3">
                            <div className="flex items-center gap-1">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-7 text-xs">View</Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader><DialogTitle>Lead: {l.name}</DialogTitle></DialogHeader>
                                  <div className="space-y-3 text-sm">
                                    <div className="grid grid-cols-2 gap-2">
                                      <div><p className="text-xs text-muted-foreground">Email</p><p>{l.email}</p></div>
                                      <div><p className="text-xs text-muted-foreground">Source</p><p>{sourceLabels[l.source] || l.source}</p></div>
                                      <div><p className="text-xs text-muted-foreground">Date</p><p>{new Date(l.created_at).toLocaleString()}</p></div>
                                      <div><p className="text-xs text-muted-foreground">Converted</p><p>{l.converted ? "Yes" : "No"}</p></div>
                                    </div>
                                    {(l.utm_source || l.utm_medium || l.utm_campaign) && (
                                      <div>
                                        <p className="text-xs text-muted-foreground mb-1">UTM Parameters</p>
                                        <div className="rounded bg-muted p-2 text-xs space-y-1">
                                          {l.utm_source && <p>Source: {l.utm_source}</p>}
                                          {l.utm_medium && <p>Medium: {l.utm_medium}</p>}
                                          {l.utm_campaign && <p>Campaign: {l.utm_campaign}</p>}
                                        </div>
                                      </div>
                                    )}
                                    <div>
                                      <p className="text-xs text-muted-foreground mb-1">Form Answers</p>
                                      <div className="rounded bg-muted p-2 text-xs space-y-1">
                                        {Object.entries(l.form_data || {}).map(([key, val]) => (
                                          <p key={key}><span className="font-medium capitalize">{key.replace(/_/g, " ")}:</span> {String(val)}</p>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                              <Button
                                variant={l.converted ? "outline" : "default"}
                                size="sm"
                                className="h-7 text-xs"
                                onClick={() => toggleConverted(l.id, l.converted)}
                              >
                                {l.converted ? "Unmark" : "Mark Converted"}
                              </Button>
                            </div>
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
