import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Search, RefreshCw, Sparkles, CheckCircle2, Download, Eye } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/eligibility-leads")({
  head: () => ({ meta: [{ title: "Eligibility Leads — Admin" }] }),
  component: EligibilityLeadsPage,
});

const LEAD_STATUSES = ["new", "contacted", "qualified", "converted", "lost"] as const;

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  new: { label: "New", color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  contacted: { label: "Contacted", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  qualified: { label: "Qualified", color: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400" },
  converted: { label: "Converted", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
  lost: { label: "Lost", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

type EligibilityLead = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  interest: string | null;
  status: string;
  converted: boolean;
  created_at: string;
  form_data: Record<string, any> | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
};

function EligibilityLeadsPage() {
  const [leads, setLeads] = useState<EligibilityLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<EligibilityLead | null>(null);

  async function loadLeads() {
    setLoading(true);
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .eq("source", "eligibility-check")
      .order("created_at", { ascending: false })
      .limit(500);

    if (error) {
      toast.error("Failed to load eligibility leads");
    } else {
      setLeads((data || []) as EligibilityLead[]);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadLeads();
  }, []);

  async function updateStatus(id: string, status: string) {
    const prev = leads;
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status, converted: status === "converted" ? true : l.converted } : l)));
    const { error } = await supabase
      .from("leads")
      .update({ status, ...(status === "converted" ? { converted: true } : {}) })
      .eq("id", id);
    if (error) {
      setLeads(prev);
      toast.error("Failed to update status");
    } else {
      toast.success("Status updated");
    }
  }

  const filtered = leads.filter((l) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      l.email.toLowerCase().includes(q) ||
      (l.country || "").toLowerCase().includes(q)
    );
  });

  const stats = {
    total: leads.length,
    qualified: leads.filter((l) => l.form_data?.eligibility_result === "qualified").length,
    converted: leads.filter((l) => l.converted).length,
    last7days: leads.filter(
      (l) => new Date(l.created_at).getTime() > Date.now() - 7 * 24 * 60 * 60 * 1000
    ).length,
  };

  function exportCsv() {
    const rows = [
      ["Date", "Name", "Email", "Destination", "Visa Type", "Education", "Experience", "Result", "Status"],
      ...filtered.map((l) => [
        format(new Date(l.created_at), "yyyy-MM-dd HH:mm"),
        l.name,
        l.email,
        l.form_data?.destination || "",
        l.form_data?.visaType || "",
        l.form_data?.education || "",
        l.form_data?.experience || "",
        l.form_data?.eligibility_result || "",
        l.status,
      ]),
    ];
    const csv = rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `eligibility-leads-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6 lg:p-8 space-y-6">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                <Sparkles className="h-6 w-6 text-gold" />
                Eligibility Quiz Leads
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Submissions from the homepage "Check Your Eligibility" quiz.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={loadLeads} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={exportCsv} disabled={!filtered.length}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard label="Total submissions" value={stats.total} />
            <StatCard label="Qualified" value={stats.qualified} accent="text-green-600" />
            <StatCard label="Converted" value={stats.converted} accent="text-indigo-600" />
            <StatCard label="Last 7 days" value={stats.last7days} accent="text-gold" />
          </div>

          {/* Search */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="relative flex-1 max-w-sm">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search by name, email, country..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {filtered.length} of {leads.length}
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Name & Email</TableHead>
                      <TableHead>Destination</TableHead>
                      <TableHead>Visa Type</TableHead>
                      <TableHead>Education</TableHead>
                      <TableHead>Experience</TableHead>
                      <TableHead>Result</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[80px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-12 text-muted-foreground text-sm">
                          Loading...
                        </TableCell>
                      </TableRow>
                    ) : filtered.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={9} className="text-center py-12 text-muted-foreground text-sm">
                          No eligibility submissions yet.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filtered.map((l) => (
                        <TableRow key={l.id} className="cursor-pointer" onClick={() => setSelected(l)}>
                          <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                            {format(new Date(l.created_at), "MMM d, HH:mm")}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-sm">{l.name}</div>
                            <div className="text-xs text-muted-foreground">{l.email}</div>
                          </TableCell>
                          <TableCell className="text-sm">{l.form_data?.destination || "—"}</TableCell>
                          <TableCell className="text-sm">{l.form_data?.visaType || "—"}</TableCell>
                          <TableCell className="text-xs">{l.form_data?.education || "—"}</TableCell>
                          <TableCell className="text-xs">{l.form_data?.experience || "—"}</TableCell>
                          <TableCell>
                            {l.form_data?.eligibility_result === "qualified" ? (
                              <Badge className="bg-green-100 text-green-700 hover:bg-green-100 gap-1 dark:bg-green-900/30 dark:text-green-400">
                                <CheckCircle2 className="h-3 w-3" /> Qualified
                              </Badge>
                            ) : (
                              <Badge variant="outline">—</Badge>
                            )}
                          </TableCell>
                          <TableCell onClick={(e) => e.stopPropagation()}>
                            <Select value={l.status} onValueChange={(v) => updateStatus(l.id, v)}>
                              <SelectTrigger className={`h-8 w-[130px] text-xs font-medium border-0 ${STATUS_CONFIG[l.status]?.color || ""}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {LEAD_STATUSES.map((s) => (
                                  <SelectItem key={s} value={s} className="text-xs">
                                    {STATUS_CONFIG[s].label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelected(l); }}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Detail dialog */}
      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Eligibility submission</DialogTitle>
            <DialogDescription>
              Submitted {selected && format(new Date(selected.created_at), "PPpp")}
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <div className="space-y-4 text-sm">
              <DetailRow label="Name" value={selected.name} />
              <DetailRow label="Email" value={selected.email} />
              <DetailRow label="Destination" value={selected.form_data?.destination || "—"} />
              <DetailRow label="Visa type" value={selected.form_data?.visaType || "—"} />
              <DetailRow label="Education" value={selected.form_data?.education || "—"} />
              <DetailRow label="Experience" value={selected.form_data?.experience || "—"} />
              <DetailRow
                label="Result"
                value={selected.form_data?.eligibility_result === "qualified" ? "✓ Qualified" : "—"}
              />
              <DetailRow label="Status" value={selected.status} />
              <DetailRow label="Converted" value={selected.converted ? "Yes" : "No"} />
              {(selected.utm_source || selected.utm_medium || selected.utm_campaign) && (
                <div className="rounded-md border bg-muted/30 p-3 space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">UTM</p>
                  {selected.utm_source && <DetailRow label="Source" value={selected.utm_source} />}
                  {selected.utm_medium && <DetailRow label="Medium" value={selected.utm_medium} />}
                  {selected.utm_campaign && <DetailRow label="Campaign" value={selected.utm_campaign} />}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
        <p className={`mt-1 text-2xl font-bold ${accent || "text-foreground"}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <span className="text-sm text-right">{value}</span>
    </div>
  );
}
