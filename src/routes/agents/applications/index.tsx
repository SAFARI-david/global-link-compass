import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Search, Filter, Eye, Loader2, FileText } from "lucide-react";
import { AgentSidebar } from "@/components/agent/AgentSidebar";
import { AgentHeader } from "@/components/agent/AgentHeader";
import { StatusBadge } from "@/components/agent/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/agents/applications/")({
  head: () => ({
    meta: [{ title: "All Applications — Agent Portal" }],
  }),
  component: ApplicationsPage,
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

function ApplicationsPage() {
  const { user } = useAuth();
  const [applications, setApplications] = useState<AgentApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!user) return;

    async function fetchApplications() {
      setLoading(true);
      const { data, error } = await supabase
        .from("agent_applications" as any)
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setApplications(data as unknown as AgentApplication[]);
      }
      setLoading(false);
    }

    fetchApplications();
  }, [user]);

  const filtered = applications.filter((app) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    const clientName = ((app.form_data as any)?.fullName || "").toLowerCase();
    return (
      app.reference_number.toLowerCase().includes(q) ||
      clientName.includes(q) ||
      (app.destination_country || "").toLowerCase().includes(q) ||
      app.application_type.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex min-h-screen bg-surface">
      <AgentSidebar />
      <div className="flex flex-1 flex-col">
        <AgentHeader />
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">All Applications</h1>
            <p className="text-sm text-muted-foreground">
              {loading ? "Loading…" : `${filtered.length} application${filtered.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by reference, client, or country..."
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  <span className="ml-2 text-sm text-muted-foreground">Loading applications…</span>
                </div>
              ) : filtered.length === 0 ? (
                <div className="py-12 text-center">
                  <FileText className="mx-auto h-10 w-10 text-muted-foreground/30" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    {searchQuery ? "No applications match your search." : "No applications assigned to you yet."}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-left text-muted-foreground">
                        <th className="p-4 font-medium">Reference</th>
                        <th className="p-4 font-medium">Client</th>
                        <th className="p-4 font-medium hidden sm:table-cell">Type</th>
                        <th className="p-4 font-medium hidden md:table-cell">Country</th>
                        <th className="p-4 font-medium">Status</th>
                        <th className="p-4 font-medium hidden lg:table-cell">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((app) => (
                        <tr key={app.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                          <td className="p-4 font-medium text-primary">{app.reference_number}</td>
                          <td className="p-4">{(app.form_data as any)?.fullName || "—"}</td>
                          <td className="p-4 hidden sm:table-cell">{app.application_type}</td>
                          <td className="p-4 hidden md:table-cell">{app.destination_country || "—"}</td>
                          <td className="p-4"><StatusBadge status={app.status} /></td>
                          <td className="p-4 hidden lg:table-cell text-muted-foreground">
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
