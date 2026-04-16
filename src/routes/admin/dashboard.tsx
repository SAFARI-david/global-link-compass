import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Users, FileText, CreditCard, Briefcase, GraduationCap, UserCheck, TrendingUp, ArrowUpRight, AlertCircle, Loader2, DollarSign } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/agent/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { getAdminStats, getAdminRecentApplications } from "@/lib/dashboard.functions";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Global Link Migration Services" },
      { name: "description", content: "Admin overview and management panel." },
    ],
  }),
  component: AdminDashboardPage,
});

const PAYMENT_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  unpaid: { label: "Unpaid", color: "bg-muted text-muted-foreground" },
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700" },
  paid: { label: "Paid", color: "bg-green-100 text-green-700" },
  failed: { label: "Failed", color: "bg-red-100 text-red-700" },
};

function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [recentApps, setRecentApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const [statsRes, appsRes] = await Promise.all([
        getAdminStats(),
        getAdminRecentApplications(),
      ]);
      setStats(statsRes);
      setRecentApps(appsRes.applications);
    } catch (err) {
      console.error("Failed to load admin dashboard:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-surface">
        <AdminSidebar />
        <div className="flex flex-1 flex-col">
          <AdminHeader title="Dashboard Overview" />
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </div>
      </div>
    );
  }

  const alerts = [];
  if (stats?.statusCounts?.submitted > 0) {
    alerts.push({ message: `${stats.statusCounts.submitted} new applications awaiting review`, type: "warning" });
  }
  if (stats?.paymentStatusCounts?.unpaid > 0) {
    alerts.push({ message: `${stats.paymentStatusCounts.unpaid} unpaid payment records`, type: "warning" });
  }
  if (stats?.paymentStatusCounts?.pending_verification > 0) {
    alerts.push({ message: `${stats.paymentStatusCounts.pending_verification} payments pending verification`, type: "info" });
  }

  const statCards = [
    { label: "Total Applications", value: String(stats?.totalApplications || 0), icon: FileText, change: `+${stats?.newAppsThisWeek || 0} this week`, color: "bg-amber-100 text-amber-600" },
    { label: "Active Agents", value: String(stats?.agentCount || 0), icon: UserCheck, change: "Registered agents", color: "bg-emerald-100 text-emerald-600" },
    { label: "Active Programs", value: String(stats?.programCount || 0), icon: GraduationCap, change: "Published programs", color: "bg-cyan-100 text-cyan-600" },
    { label: "Total Revenue", value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, change: `+$${(stats?.revenueThisMonth || 0).toLocaleString()} this month`, color: "bg-green-100 text-green-600" },
    { label: "Paid Payments", value: String(stats?.paymentStatusCounts?.paid || 0), icon: CreditCard, change: `${stats?.totalPayments || 0} total records`, color: "bg-blue-100 text-blue-600" },
    { label: "Pending/Unpaid", value: String((stats?.paymentStatusCounts?.unpaid || 0) + (stats?.paymentStatusCounts?.pending || 0)), icon: AlertCircle, change: "Needs attention", color: "bg-red-100 text-red-600" },
  ];

  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader title="Dashboard Overview" />
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Alerts */}
          {alerts.length > 0 && (
            <div className="mb-6 space-y-2">
              {alerts.map((alert, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
                  <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                  <span className="text-amber-800">{alert.message}</span>
                </div>
              ))}
            </div>
          )}

          {/* Stats Grid */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {statCards.map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-5">
                  <div className="flex items-center justify-between">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.color}`}>
                      <stat.icon className="h-5 w-5" />
                    </div>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="mt-4">
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">{stat.change}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Recent Applications */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Applications</CardTitle>
              <Link to="/admin/applications" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                View all <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>
            <CardContent>
              {recentApps.length === 0 ? (
                <p className="py-8 text-center text-muted-foreground text-sm">No applications yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-muted-foreground">
                        <th className="pb-3 pr-4 font-medium">Reference</th>
                        <th className="pb-3 pr-4 font-medium">Applicant</th>
                        <th className="pb-3 pr-4 font-medium hidden sm:table-cell">Type</th>
                        <th className="pb-3 pr-4 font-medium hidden md:table-cell">Country</th>
                        <th className="pb-3 pr-4 font-medium">Status</th>
                        <th className="pb-3 pr-4 font-medium">Payment</th>
                        <th className="pb-3 font-medium hidden lg:table-cell">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentApps.map((app) => {
                        const fd = (app.form_data || {}) as Record<string, any>;
                        const pConf = PAYMENT_STATUS_CONFIG[app.payment_status] || PAYMENT_STATUS_CONFIG.unpaid;
                        return (
                          <tr key={app.id} className="border-b border-border/50 last:border-0">
                            <td className="py-3 pr-4 font-medium text-primary">{app.reference_number}</td>
                            <td className="py-3 pr-4">
                              <p className="font-medium">{fd.fullName || fd.full_name || "—"}</p>
                              <p className="text-xs text-muted-foreground">{fd.email || ""}</p>
                            </td>
                            <td className="py-3 pr-4 hidden sm:table-cell">{app.application_type}</td>
                            <td className="py-3 pr-4 hidden md:table-cell">{app.destination_country || "—"}</td>
                            <td className="py-3 pr-4"><StatusBadge status={app.status} /></td>
                            <td className="py-3 pr-4">
                              <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${pConf.color}`}>
                                {pConf.label}
                              </span>
                            </td>
                            <td className="py-3 hidden lg:table-cell text-muted-foreground">
                              {new Date(app.created_at).toLocaleDateString()}
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
