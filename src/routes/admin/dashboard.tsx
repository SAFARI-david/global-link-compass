import { createFileRoute } from "@tanstack/react-router";
import { Users, FileText, CreditCard, Briefcase, GraduationCap, UserCheck, TrendingUp, ArrowUpRight, AlertCircle } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/agent/StatusBadge";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — Global Link Migration Services" },
      { name: "description", content: "Admin overview and management panel." },
    ],
  }),
  component: AdminDashboardPage,
});

const stats = [
  { label: "Total Applicants", value: "1,284", icon: Users, change: "+48 this week", color: "bg-blue-100 text-blue-600" },
  { label: "Active Agents", value: "36", icon: UserCheck, change: "+2 this month", color: "bg-emerald-100 text-emerald-600" },
  { label: "Applications", value: "847", icon: FileText, change: "124 pending", color: "bg-amber-100 text-amber-600" },
  { label: "Jobs Listed", value: "156", icon: Briefcase, change: "12 new", color: "bg-purple-100 text-purple-600" },
  { label: "Programs", value: "89", icon: GraduationCap, change: "5 new", color: "bg-cyan-100 text-cyan-600" },
  { label: "Revenue", value: "$124,800", icon: CreditCard, change: "+$18,400 this month", color: "bg-green-100 text-green-600" },
];

const recentApplications = [
  { id: "APP-2026-0412", applicant: "Mohammed Al-Rashid", type: "Work Visa", country: "Canada", agent: "Sarah Miller", status: "under_review", date: "2026-04-15" },
  { id: "APP-2026-0411", applicant: "Priya Sharma", type: "Study Visa", country: "UK", agent: "John Smith", status: "pending_documents", date: "2026-04-14" },
  { id: "APP-2026-0410", applicant: "David Chen", type: "Work Visa", country: "Australia", agent: "Sarah Miller", status: "approved", date: "2026-04-13" },
  { id: "APP-2026-0409", applicant: "Fatima Zahra", type: "Study Visa", country: "Germany", agent: "Unassigned", status: "submitted", date: "2026-04-12" },
  { id: "APP-2026-0408", applicant: "James Okonkwo", type: "Work Visa", country: "Canada", agent: "Maria Lopez", status: "in_progress", date: "2026-04-11" },
];

const alerts = [
  { message: "12 applications pending review for more than 48 hours", type: "warning" },
  { message: "Agent registration: 3 new agents awaiting approval", type: "info" },
  { message: "Payment overdue: 5 clients have outstanding balances", type: "warning" },
];

function AdminDashboardPage() {
  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader title="Dashboard Overview" />
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Alerts */}
          <div className="mb-6 space-y-2">
            {alerts.map((alert, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
                <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" />
                <span className="text-amber-800">{alert.message}</span>
              </div>
            ))}
          </div>

          {/* Stats Grid */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {stats.map((stat) => (
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
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-3 pr-4 font-medium">ID</th>
                      <th className="pb-3 pr-4 font-medium">Applicant</th>
                      <th className="pb-3 pr-4 font-medium hidden sm:table-cell">Type</th>
                      <th className="pb-3 pr-4 font-medium hidden md:table-cell">Country</th>
                      <th className="pb-3 pr-4 font-medium hidden lg:table-cell">Agent</th>
                      <th className="pb-3 pr-4 font-medium">Status</th>
                      <th className="pb-3 font-medium hidden xl:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentApplications.map((app) => (
                      <tr key={app.id} className="border-b border-border/50 last:border-0">
                        <td className="py-3 pr-4 font-medium text-primary">{app.id}</td>
                        <td className="py-3 pr-4">{app.applicant}</td>
                        <td className="py-3 pr-4 hidden sm:table-cell">{app.type}</td>
                        <td className="py-3 pr-4 hidden md:table-cell">{app.country}</td>
                        <td className="py-3 pr-4 hidden lg:table-cell">{app.agent}</td>
                        <td className="py-3 pr-4"><StatusBadge status={app.status} /></td>
                        <td className="py-3 hidden xl:table-cell text-muted-foreground">{app.date}</td>
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
