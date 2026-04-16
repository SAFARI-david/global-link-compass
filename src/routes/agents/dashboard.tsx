import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Users, FileText, CreditCard, Clock, TrendingUp, ArrowUpRight, Plus, Loader2 } from "lucide-react";
import { AgentSidebar } from "@/components/agent/AgentSidebar";
import { AgentHeader } from "@/components/agent/AgentHeader";
import { StatusBadge } from "@/components/agent/StatusBadge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/agents/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — Agent Portal" },
      { name: "description", content: "Agent dashboard overview." },
    ],
  }),
  component: AgentDashboardPage,
});

interface AgentApplication {
  id: string;
  reference_number: string;
  application_type: string;
  status: string;
  destination_country: string | null;
  form_data: Record<string, string>;
  created_at: string;
}

function AgentDashboardPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<AgentApplication[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchData() {
      setLoading(true);
      // Query the agent_applications view (excludes admin_notes)
      const { data, error } = await supabase
        .from("agent_applications" as any)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5);

      if (!error && data) {
        setApplications(data as unknown as AgentApplication[]);
      }
      setLoading(false);
    }

    fetchData();
  }, [user]);

  const totalApps = applications.length;
  const activeApps = applications.filter((a) =>
    ["submitted", "under_review", "in_progress", "pending_documents"].includes(a.status)
  ).length;

  const stats = [
    { label: "Total Applications", value: String(totalApps), icon: FileText, change: "Assigned to you", color: "bg-amber-100 text-amber-600" },
    { label: "Active Applications", value: String(activeApps), icon: Clock, change: "In progress", color: "bg-blue-100 text-blue-600" },
    { label: "Approved", value: String(applications.filter((a) => a.status === "approved").length), icon: Users, change: "Completed", color: "bg-green-100 text-green-600" },
    { label: "Pending Documents", value: String(applications.filter((a) => a.status === "pending_documents").length), icon: CreditCard, change: "Needs action", color: "bg-purple-100 text-purple-600" },
  ];

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
              <p className="text-sm text-muted-foreground">Here's an overview of your assigned applications.</p>
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
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">Loading applications…</span>
                </div>
              ) : applications.length === 0 ? (
                <div className="py-8 text-center">
                  <FileText className="mx-auto h-10 w-10 text-muted-foreground/30" />
                  <p className="mt-3 text-sm text-muted-foreground">No applications assigned to you yet.</p>
                  <Link to="/agents/applications/work-visa" className="mt-3 inline-block">
                    <Button variant="outline" size="sm">Submit First Application</Button>
                  </Link>
                </div>
              ) : (
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
                      {applications.map((app) => (
                        <tr key={app.id} className="border-b border-border/50 last:border-0">
                          <td className="py-3 pr-4 font-medium text-primary">{app.reference_number}</td>
                          <td className="py-3 pr-4">{(app.form_data as any)?.fullName || "—"}</td>
                          <td className="py-3 pr-4 hidden sm:table-cell">{app.application_type}</td>
                          <td className="py-3 pr-4 hidden md:table-cell">{app.destination_country || "—"}</td>
                          <td className="py-3 pr-4"><StatusBadge status={app.status} /></td>
                          <td className="py-3 hidden lg:table-cell text-muted-foreground">
                            {new Date(app.created_at).toLocaleDateString()}
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
