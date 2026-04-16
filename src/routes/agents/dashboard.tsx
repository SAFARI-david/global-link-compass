import { createFileRoute, Link } from "@tanstack/react-router";
import { Users, FileText, CreditCard, Clock, TrendingUp, ArrowUpRight, Plus } from "lucide-react";
import { AgentSidebar } from "@/components/agent/AgentSidebar";
import { AgentHeader } from "@/components/agent/AgentHeader";
import { StatusBadge } from "@/components/agent/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/agents/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Agent Portal" },
      { name: "description", content: "Agent dashboard overview." },
    ],
  }),
  component: AgentDashboardPage,
});

const stats = [
  { label: "Total Clients", value: "24", icon: Users, change: "+3 this month", color: "bg-blue-100 text-blue-600" },
  { label: "Active Applications", value: "12", icon: FileText, change: "5 pending", color: "bg-amber-100 text-amber-600" },
  { label: "Total Revenue", value: "$8,400", icon: CreditCard, change: "+$1,200 this month", color: "bg-green-100 text-green-600" },
  { label: "Avg. Processing", value: "14 days", icon: Clock, change: "↓ 2 days", color: "bg-purple-100 text-purple-600" },
];

const recentApplications = [
  { id: "WV-2024-0012", client: "Mohammed Al-Rashid", type: "Work Visa", country: "Canada", status: "under_review", date: "2024-03-15" },
  { id: "SV-2024-0008", client: "Priya Sharma", type: "Study Visa", country: "UK", status: "pending_documents", date: "2024-03-14" },
  { id: "WV-2024-0011", client: "David Chen", type: "Work Visa", country: "Australia", status: "in_progress", date: "2024-03-12" },
  { id: "WV-2024-0010", client: "Fatima Zahra", type: "Work Visa", country: "Canada", status: "submitted", date: "2024-03-10" },
  { id: "SV-2024-0007", client: "James Okonkwo", type: "Study Visa", country: "Germany", status: "approved", date: "2024-03-08" },
];

function AgentDashboardPage() {
  return (
    <div className="flex min-h-screen bg-surface">
      <AgentSidebar />
      <div className="flex flex-1 flex-col">
        <AgentHeader />
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          {/* Welcome */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Welcome back, Agent</h1>
              <p className="text-sm text-muted-foreground">Here's an overview of your clients and applications.</p>
            </div>
            <Link to="/agents/clients/new">
              <Button variant="gold">
                <Plus className="mr-2 h-4 w-4" /> Add Client
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
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
              <Link to="/agents/applications" className="text-sm font-medium text-primary hover:underline flex items-center gap-1">
                View all <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="pb-3 pr-4 font-medium">Reference</th>
                      <th className="pb-3 pr-4 font-medium">Client</th>
                      <th className="pb-3 pr-4 font-medium hidden sm:table-cell">Type</th>
                      <th className="pb-3 pr-4 font-medium hidden md:table-cell">Country</th>
                      <th className="pb-3 pr-4 font-medium">Status</th>
                      <th className="pb-3 font-medium hidden lg:table-cell">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentApplications.map((app) => (
                      <tr key={app.id} className="border-b border-border/50 last:border-0">
                        <td className="py-3 pr-4 font-medium text-primary">{app.id}</td>
                        <td className="py-3 pr-4">{app.client}</td>
                        <td className="py-3 pr-4 hidden sm:table-cell">{app.type}</td>
                        <td className="py-3 pr-4 hidden md:table-cell">{app.country}</td>
                        <td className="py-3 pr-4"><StatusBadge status={app.status} /></td>
                        <td className="py-3 hidden lg:table-cell text-muted-foreground">{app.date}</td>
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
