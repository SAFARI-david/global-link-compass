import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Search, RefreshCw, Users, TrendingUp, Target, CheckCircle, Download, CalendarIcon, X, ArrowRight, MoreHorizontal } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/leads")({
  head: () => ({ meta: [{ title: "Leads — Admin" }] }),
  component: AdminLeadsPage,
});

const sourceLabels: Record<string, string> = {
  "canada-work": "Canada Work Visa",
  study: "Study Abroad",
  jobs: "Jobs",
};

const LEAD_STATUSES = ["new", "contacted", "qualified", "converted", "lost"] as const;

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  new: { label: "New", color: "bg-amber-100 text-amber-700" },
  contacted: { label: "Contacted", color: "bg-blue-100 text-blue-700" },
  qualified: { label: "Qualified", color: "bg-indigo-100 text-indigo-700" },
  converted: { label: "Converted", color: "bg-green-100 text-green-700" },
  lost: { label: "Lost", color: "bg-red-100 text-red-700" },
};

const INTEREST_LABELS: Record<string, string> = {
  work: "Work Visa",
  study: "Study Visa",
  jobs: "Job Placement",
};

function AdminLeadsPage() {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [converting, setConverting] = useState<string | null>(null);

  useEffect(() => { load(); }, [sourceFilter, statusFilter, dateFrom, dateTo]);

  async function load() {
    setLoading(true);
    try {
      let q = supabase.from("leads").select("*").order("created_at", { ascending: false });
      if (sourceFilter !== "all") q = q.eq("source", sourceFilter);
      if (statusFilter !== "all") q = q.eq("status", statusFilter);
      if (dateFrom) q = q.gte("created_at", dateFrom.toISOString());
      if (dateTo) {
        const endOfDay = new Date(dateTo);
        endOfDay.setHours(23, 59, 59, 999);
        q = q.lte("created_at", endOfDay.toISOString());
      }
      const { data, error } = await q;
      if (error) throw error;
      setLeads(data || []);
    } catch {
      toast.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  }

  async function updateLeadStatus(id: string, status: string) {
    try {
      const updates: any = { status };
      if (status === "converted") updates.converted = true;
      const { error } = await supabase.from("leads").update(updates).eq("id", id);
      if (error) throw error;
      toast.success(`Lead status updated to ${STATUS_CONFIG[status]?.label || status}`);
      load();
    } catch {
      toast.error("Failed to update lead status");
    }
  }

  async function convertToApplication(lead: any) {
    setConverting(lead.id);
    try {
      const interestToType: Record<string, string> = {
        work: "Work Visa",
        study: "Study Visa",
        jobs: "Work Visa",
      };
      const applicationType = interestToType[lead.interest] || "Work Visa";

      // Create the application
      const { data: app, error: appErr } = await supabase
        .from("applications")
        .insert({
          application_type: applicationType,
          destination_country: lead.country || lead.form_data?.country || null,
          form_data: {
            fullName: lead.name,
            email: lead.email,
            ...(lead.form_data || {}),
            lead_source: lead.source,
            lead_id: lead.id,
          },
          reference_number: "", // trigger will generate
          user_id: null, // no user yet, admin-created
        } as any)
        .select("id, reference_number")
        .single();

      if (appErr) throw appErr;

      // Link lead to application and mark as converted
      await supabase
        .from("leads")
        .update({
          status: "converted",
          converted: true,
          application_id: app.id,
        } as any)
        .eq("id", lead.id);

      toast.success(`Lead converted! Application ${app.reference_number} created.`);
      load();
    } catch (err: any) {
      console.error("Conversion error:", err);
      toast.error("Failed to convert lead to application");
    } finally {
      setConverting(null);
    }
  }

  const filtered = leads.filter(
    (l) =>
      l.name?.toLowerCase().includes(search.toLowerCase()) ||
      l.email?.toLowerCase().includes(search.toLowerCase()),
  );

  function exportToCSV() {
    const headers = ["Name", "Email", "Source", "Interest", "Country", "Status", "UTM Source", "UTM Medium", "UTM Campaign", "Date", "Form Data"];
    const rows = filtered.map((l) => [
      l.name, l.email,
      sourceLabels[l.source] || l.source,
      INTEREST_LABELS[l.interest] || l.interest || "",
      l.country || "",
      STATUS_CONFIG[l.status]?.label || l.status || "New",
      l.utm_source || "", l.utm_medium || "", l.utm_campaign || "",
      new Date(l.created_at).toLocaleDateString(),
      JSON.stringify(l.form_data || {}),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    const dateLabel = dateFrom || dateTo
      ? `-${dateFrom ? format(dateFrom, "yyyy-MM-dd") : "start"}-to-${dateTo ? format(dateTo, "yyyy-MM-dd") : "now"}`
      : "";
    link.download = `leads-export${dateLabel}-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    toast.success(`Exported ${filtered.length} leads to CSV`);
  }

  function clearDateFilter() {
    setDateFrom(undefined);
    setDateTo(undefined);
  }

  const stats = {
    total: leads.length,
    today: leads.filter((l) => new Date(l.created_at).toDateString() === new Date().toDateString()).length,
    converted: leads.filter((l) => l.status === "converted" || l.converted).length,
    qualified: leads.filter((l) => l.status === "qualified").length,
    conversionRate: leads.length > 0 ? Math.round((leads.filter((l) => l.status === "converted" || l.converted).length / leads.length) * 100) : 0,
  };

  const hasDateFilter = dateFrom || dateTo;

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
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600"><Target className="h-5 w-5" /></div><div><p className="text-2xl font-bold">{stats.qualified}</p><p className="text-sm text-muted-foreground">Qualified</p></div></div></CardContent></Card>
            <Card><CardContent className="p-4"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600"><CheckCircle className="h-5 w-5" /></div><div><p className="text-2xl font-bold">{stats.conversionRate}%</p><p className="text-sm text-muted-foreground">Conversion Rate</p></div></div></CardContent></Card>
          </div>

          <Card>
            <CardHeader className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Lead Submissions</CardTitle>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm" onClick={exportToCSV} className="gap-2">
                    <Download className="h-4 w-4" />Export CSV
                  </Button>
                  <Button variant="outline" size="icon" onClick={load}><RefreshCw className="h-4 w-4" /></Button>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
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
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    {LEAD_STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>{STATUS_CONFIG[s].label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex items-center gap-1.5 rounded-md border border-border/50 bg-muted/30 p-1">
                  <Button variant={!dateFrom && !dateTo ? "default" : "ghost"} size="sm" className="h-7 px-2.5 text-xs" onClick={clearDateFilter}>All time</Button>
                  {[
                    { label: "7d", days: 7 },
                    { label: "30d", days: 30 },
                    { label: "This month", days: 0 },
                  ].map((preset) => {
                    const isActive = preset.days === 0
                      ? dateFrom?.toDateString() === new Date(new Date().getFullYear(), new Date().getMonth(), 1).toDateString() && !dateTo
                      : dateFrom?.toDateString() === new Date(Date.now() - preset.days * 86400000).toDateString() && !dateTo;
                    return (
                      <Button
                        key={preset.label}
                        variant={isActive ? "default" : "ghost"}
                        size="sm"
                        className="h-7 px-2.5 text-xs"
                        onClick={() => {
                          const from = preset.days === 0
                            ? new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                            : new Date(Date.now() - preset.days * 86400000);
                          setDateFrom(from);
                          setDateTo(undefined);
                        }}
                      >
                        {preset.label}
                      </Button>
                    );
                  })}
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className={cn("gap-2 text-xs", dateFrom && "border-primary text-primary")}>
                      <CalendarIcon className="h-3.5 w-3.5" />
                      {dateFrom ? format(dateFrom, "MMM d, yyyy") : "From date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} disabled={(d) => (dateTo ? d > dateTo : false)} initialFocus className={cn("p-3 pointer-events-auto")} />
                  </PopoverContent>
                </Popover>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm" className={cn("gap-2 text-xs", dateTo && "border-primary text-primary")}>
                      <CalendarIcon className="h-3.5 w-3.5" />
                      {dateTo ? format(dateTo, "MMM d, yyyy") : "To date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar mode="single" selected={dateTo} onSelect={setDateTo} disabled={(d) => (dateFrom ? d < dateFrom : false)} initialFocus className={cn("p-3 pointer-events-auto")} />
                  </PopoverContent>
                </Popover>
                {hasDateFilter && (
                  <Button variant="ghost" size="sm" onClick={clearDateFilter} className="h-8 gap-1 text-xs text-muted-foreground">
                    <X className="h-3.5 w-3.5" />Clear dates
                  </Button>
                )}
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
                        <th className="pb-3 pr-4 font-medium">Interest</th>
                        <th className="pb-3 pr-4 font-medium hidden sm:table-cell">Source</th>
                        <th className="pb-3 pr-4 font-medium">Status</th>
                        <th className="pb-3 pr-4 font-medium hidden md:table-cell">Date</th>
                        <th className="pb-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((l) => {
                        const sc = STATUS_CONFIG[l.status] || STATUS_CONFIG.new;
                        return (
                          <tr key={l.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30">
                            <td className="py-3 pr-4">
                              <p className="font-medium">{l.name}</p>
                              {l.country && <p className="text-xs text-muted-foreground">{l.country}</p>}
                            </td>
                            <td className="py-3 pr-4 text-primary">{l.email}</td>
                            <td className="py-3 pr-4">
                              <Badge variant="secondary" className="text-xs">
                                {INTEREST_LABELS[l.interest] || sourceLabels[l.source] || l.source}
                              </Badge>
                            </td>
                            <td className="py-3 pr-4 hidden sm:table-cell text-xs text-muted-foreground">
                              {l.utm_campaign || l.utm_source || sourceLabels[l.source] || l.source}
                            </td>
                            <td className="py-3 pr-4">
                              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${sc.color}`}>
                                {sc.label}
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
                                        <div><p className="text-xs text-muted-foreground">Interest</p><p>{INTEREST_LABELS[l.interest] || l.interest || "—"}</p></div>
                                        <div><p className="text-xs text-muted-foreground">Country</p><p>{l.country || "—"}</p></div>
                                        <div><p className="text-xs text-muted-foreground">Source</p><p>{sourceLabels[l.source] || l.source}</p></div>
                                        <div><p className="text-xs text-muted-foreground">Status</p><p className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${sc.color}`}>{sc.label}</p></div>
                                        <div><p className="text-xs text-muted-foreground">Date</p><p>{new Date(l.created_at).toLocaleString()}</p></div>
                                      </div>
                                      {l.application_id && (
                                        <div className="rounded-lg border bg-green-50 p-3">
                                          <p className="text-xs font-semibold text-green-700">✓ Converted to Application</p>
                                          <p className="text-xs text-green-600">Application ID: {l.application_id}</p>
                                        </div>
                                      )}
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

                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    {LEAD_STATUSES.filter((s) => s !== l.status).map((s) => (
                                      <DropdownMenuItem key={s} onClick={() => updateLeadStatus(l.id, s)}>
                                        <span className={`mr-2 inline-block h-2 w-2 rounded-full ${STATUS_CONFIG[s].color.split(" ")[0]}`} />
                                        Mark as {STATUS_CONFIG[s].label}
                                      </DropdownMenuItem>
                                    ))}
                                    {l.status !== "converted" && !l.application_id && (
                                      <>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                          onClick={() => convertToApplication(l)}
                                          disabled={converting === l.id}
                                          className="text-primary font-medium"
                                        >
                                          <ArrowRight className="mr-2 h-4 w-4" />
                                          {converting === l.id ? "Converting..." : "Convert to Application"}
                                        </DropdownMenuItem>
                                      </>
                                    )}
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
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
