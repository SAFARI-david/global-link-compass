import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Users, ArrowRight, CheckCircle, TrendingUp, Target,
  BarChart3, Globe, Zap, Filter,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/analytics")({
  head: () => ({ meta: [{ title: "Analytics — Admin" }] }),
  component: AdminAnalyticsPage,
});

interface Lead {
  id: string;
  name: string;
  email: string;
  source: string;
  interest: string | null;
  country: string | null;
  status: string;
  converted: boolean;
  application_id: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  created_at: string;
}

const PERIOD_OPTIONS = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "90", label: "Last 90 days" },
  { value: "all", label: "All time" },
];

const STATUS_COLORS: Record<string, string> = {
  new: "bg-amber-500",
  contacted: "bg-blue-500",
  qualified: "bg-indigo-500",
  converted: "bg-green-500",
  lost: "bg-red-500",
};

function AdminAnalyticsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30");

  useEffect(() => {
    loadLeads();
  }, [period]);

  async function loadLeads() {
    setLoading(true);
    try {
      let q = supabase.from("leads").select("*").order("created_at", { ascending: false });
      if (period !== "all") {
        const from = new Date(Date.now() - parseInt(period) * 86400000);
        q = q.gte("created_at", from.toISOString());
      }
      const { data, error } = await q;
      if (error) throw error;
      setLeads((data as Lead[]) || []);
    } catch {
      toast.error("Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  }

  const metrics = useMemo(() => {
    const total = leads.length;
    const byStatus: Record<string, number> = {};
    const bySrc: Record<string, { total: number; converted: number }> = {};
    const byInterest: Record<string, { total: number; converted: number }> = {};
    const byCountry: Record<string, number> = {};
    const byDay: Record<string, number> = {};
    const byUtmSource: Record<string, number> = {};

    for (const l of leads) {
      // Status distribution
      const s = l.status || "new";
      byStatus[s] = (byStatus[s] || 0) + 1;

      // Source breakdown
      const src = l.source || "direct";
      if (!bySrc[src]) bySrc[src] = { total: 0, converted: 0 };
      bySrc[src].total++;
      if (l.converted || l.status === "converted") bySrc[src].converted++;

      // Interest breakdown
      const int = l.interest || "unknown";
      if (!byInterest[int]) byInterest[int] = { total: 0, converted: 0 };
      byInterest[int].total++;
      if (l.converted || l.status === "converted") byInterest[int].converted++;

      // Country
      if (l.country) byCountry[l.country] = (byCountry[l.country] || 0) + 1;

      // Daily trend
      const day = new Date(l.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      byDay[day] = (byDay[day] || 0) + 1;

      // UTM source
      if (l.utm_source) byUtmSource[l.utm_source] = (byUtmSource[l.utm_source] || 0) + 1;
    }

    const converted = leads.filter((l) => l.converted || l.status === "converted").length;
    const qualified = leads.filter((l) => l.status === "qualified").length;
    const contacted = leads.filter((l) => l.status === "contacted").length;
    const lost = leads.filter((l) => l.status === "lost").length;
    const newLeads = leads.filter((l) => l.status === "new").length;

    return {
      total,
      converted,
      qualified,
      contacted,
      lost,
      newLeads,
      conversionRate: total > 0 ? ((converted / total) * 100).toFixed(1) : "0",
      qualificationRate: total > 0 ? (((qualified + converted) / total) * 100).toFixed(1) : "0",
      contactRate: total > 0 ? (((contacted + qualified + converted) / total) * 100).toFixed(1) : "0",
      byStatus,
      bySrc: Object.entries(bySrc)
        .sort((a, b) => b[1].total - a[1].total),
      byInterest: Object.entries(byInterest)
        .sort((a, b) => b[1].total - a[1].total),
      byCountry: Object.entries(byCountry)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10),
      byDay: Object.entries(byDay).slice(-14),
      byUtmSource: Object.entries(byUtmSource)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 8),
    };
  }, [leads]);

  const maxDayCount = Math.max(...(metrics.byDay.map(([, v]) => v)), 1);

  const INTEREST_LABELS: Record<string, string> = {
    work: "Work Visa",
    study: "Study Visa",
    jobs: "Job Placement",
    unknown: "Not specified",
  };

  const SOURCE_LABELS: Record<string, string> = {
    "canada-work": "Canada Work Visa LP",
    study: "Study Abroad LP",
    jobs: "Jobs LP",
    homepage: "Homepage",
    direct: "Direct",
  };

  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader title="Lead Analytics" />
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Period selector */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Conversion Funnel</h2>
              <p className="text-sm text-muted-foreground">Track leads from capture to application</p>
            </div>
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-40">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PERIOD_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : (
            <>
              {/* KPI Cards */}
              <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-3xl font-bold">{metrics.total}</p>
                        <p className="text-xs text-muted-foreground">Total Leads</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/10">
                        <TrendingUp className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-3xl font-bold">{metrics.contactRate}%</p>
                        <p className="text-xs text-muted-foreground">Contact Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-500/10">
                        <Target className="h-5 w-5 text-indigo-500" />
                      </div>
                      <div>
                        <p className="text-3xl font-bold">{metrics.qualificationRate}%</p>
                        <p className="text-xs text-muted-foreground">Qualification Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <p className="text-3xl font-bold">{metrics.conversionRate}%</p>
                        <p className="text-xs text-muted-foreground">Conversion Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Funnel Visualization */}
              <Card className="mb-6">
                <CardHeader><CardTitle className="text-base">Lead Funnel</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { label: "New Leads", count: metrics.total, pct: 100, color: "bg-amber-500" },
                      { label: "Contacted", count: metrics.contacted + metrics.qualified + metrics.converted, pct: parseFloat(metrics.contactRate), color: "bg-blue-500" },
                      { label: "Qualified", count: metrics.qualified + metrics.converted, pct: parseFloat(metrics.qualificationRate), color: "bg-indigo-500" },
                      { label: "Converted", count: metrics.converted, pct: parseFloat(metrics.conversionRate), color: "bg-green-500" },
                    ].map((stage, i) => (
                      <div key={stage.label} className="flex items-center gap-4">
                        <div className="w-24 text-sm font-medium text-right">{stage.label}</div>
                        <div className="flex-1">
                          <div className="relative h-9 rounded-lg bg-muted/50 overflow-hidden">
                            <div
                              className={`absolute inset-y-0 left-0 rounded-lg ${stage.color} transition-all duration-700`}
                              style={{ width: `${Math.max(stage.pct, 2)}%` }}
                            />
                            <div className="absolute inset-0 flex items-center px-3">
                              <span className="text-sm font-semibold text-foreground drop-shadow-sm">
                                {stage.count}
                              </span>
                              <span className="ml-auto text-xs font-medium text-muted-foreground">
                                {stage.pct.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        </div>
                        {i < 3 && <ArrowRight className="h-4 w-4 text-muted-foreground/40 shrink-0" />}
                        {i === 3 && <div className="w-4" />}
                      </div>
                    ))}
                  </div>
                  {metrics.lost > 0 && (
                    <div className="mt-4 flex items-center gap-4">
                      <div className="w-24 text-sm font-medium text-right text-red-500">Lost</div>
                      <div className="flex-1">
                        <div className="relative h-9 rounded-lg bg-muted/50 overflow-hidden">
                          <div
                            className="absolute inset-y-0 left-0 rounded-lg bg-red-500/70 transition-all duration-700"
                            style={{ width: `${Math.max((metrics.lost / metrics.total) * 100, 2)}%` }}
                          />
                          <div className="absolute inset-0 flex items-center px-3">
                            <span className="text-sm font-semibold text-foreground drop-shadow-sm">{metrics.lost}</span>
                            <span className="ml-auto text-xs font-medium text-muted-foreground">
                              {((metrics.lost / metrics.total) * 100).toFixed(1)}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="w-4" />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Charts Row */}
              <div className="mb-6 grid gap-6 lg:grid-cols-2">
                {/* Daily Trend */}
                <Card>
                  <CardHeader><CardTitle className="text-base">Daily Lead Volume</CardTitle></CardHeader>
                  <CardContent>
                    {metrics.byDay.length === 0 ? (
                      <p className="py-8 text-center text-sm text-muted-foreground">No data yet</p>
                    ) : (
                      <div className="flex items-end gap-1.5" style={{ height: 160 }}>
                        {metrics.byDay.map(([day, count]) => (
                          <div key={day} className="flex flex-1 flex-col items-center gap-1">
                            <span className="text-[10px] font-semibold">{count}</span>
                            <div
                              className="w-full rounded-t bg-primary/80 transition-all"
                              style={{ height: `${(count / maxDayCount) * 120}px`, minHeight: 4 }}
                            />
                            <span className="text-[9px] text-muted-foreground truncate w-full text-center">{day}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Status Distribution */}
                <Card>
                  <CardHeader><CardTitle className="text-base">Status Distribution</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(metrics.byStatus)
                        .sort((a, b) => b[1] - a[1])
                        .map(([status, count]) => {
                          const pct = metrics.total > 0 ? (count / metrics.total) * 100 : 0;
                          return (
                            <div key={status} className="flex items-center gap-3">
                              <div className={`h-3 w-3 rounded-full ${STATUS_COLORS[status] || "bg-gray-400"}`} />
                              <span className="w-20 text-sm capitalize">{status}</span>
                              <div className="flex-1 h-2.5 rounded-full bg-muted/50 overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${STATUS_COLORS[status] || "bg-gray-400"} transition-all`}
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="w-8 text-right text-sm font-semibold">{count}</span>
                              <span className="w-12 text-right text-xs text-muted-foreground">{pct.toFixed(0)}%</span>
                            </div>
                          );
                        })}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Source & Interest Breakdown */}
              <div className="mb-6 grid gap-6 lg:grid-cols-3">
                {/* By Source */}
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Zap className="h-4 w-4" />By Source</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {metrics.bySrc.map(([src, data]) => (
                        <div key={src} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{SOURCE_LABELS[src] || src}</p>
                            <p className="text-xs text-muted-foreground">{data.converted} converted</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold">{data.total}</p>
                            <p className="text-xs text-green-600">
                              {data.total > 0 ? ((data.converted / data.total) * 100).toFixed(0) : 0}% CVR
                            </p>
                          </div>
                        </div>
                      ))}
                      {metrics.bySrc.length === 0 && (
                        <p className="py-4 text-center text-sm text-muted-foreground">No sources yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* By Interest */}
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2 text-base"><BarChart3 className="h-4 w-4" />By Interest</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {metrics.byInterest.map(([interest, data]) => (
                        <div key={interest} className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium">{INTEREST_LABELS[interest] || interest}</p>
                            <p className="text-xs text-muted-foreground">{data.converted} converted</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold">{data.total}</p>
                            <p className="text-xs text-green-600">
                              {data.total > 0 ? ((data.converted / data.total) * 100).toFixed(0) : 0}% CVR
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Countries */}
                <Card>
                  <CardHeader><CardTitle className="flex items-center gap-2 text-base"><Globe className="h-4 w-4" />Top Countries</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-2.5">
                      {metrics.byCountry.map(([country, count], i) => (
                        <div key={country} className="flex items-center gap-3">
                          <span className="w-5 text-xs text-muted-foreground font-medium">{i + 1}</span>
                          <span className="flex-1 text-sm">{country}</span>
                          <Badge variant="secondary" className="text-xs">{count}</Badge>
                        </div>
                      ))}
                      {metrics.byCountry.length === 0 && (
                        <p className="py-4 text-center text-sm text-muted-foreground">No country data yet</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* UTM Sources */}
              {metrics.byUtmSource.length > 0 && (
                <Card>
                  <CardHeader><CardTitle className="text-base">Marketing Channels (UTM Sources)</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      {metrics.byUtmSource.map(([utm, count]) => (
                        <div key={utm} className="rounded-lg border border-border/50 p-3">
                          <p className="text-sm font-medium">{utm}</p>
                          <p className="text-2xl font-bold">{count}</p>
                          <p className="text-xs text-muted-foreground">
                            {((count / metrics.total) * 100).toFixed(1)}% of leads
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
