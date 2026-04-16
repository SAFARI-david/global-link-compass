import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, Filter, Eye } from "lucide-react";
import { AgentSidebar } from "@/components/agent/AgentSidebar";
import { AgentHeader } from "@/components/agent/AgentHeader";
import { StatusBadge } from "@/components/agent/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/agents/applications/")({
  head: () => ({
    meta: [{ title: "All Applications — Agent Portal" }],
  }),
  component: ApplicationsPage,
});

const applications = [
  { id: "WV-2024-0012", client: "Mohammed Al-Rashid", type: "Work Visa", country: "Canada", status: "under_review", date: "2024-03-15", paid: true },
  { id: "SV-2024-0008", client: "Priya Sharma", type: "Study Visa", country: "UK", status: "pending_documents", date: "2024-03-14", paid: false },
  { id: "WV-2024-0011", client: "David Chen", type: "Work Visa", country: "Australia", status: "in_progress", date: "2024-03-12", paid: true },
  { id: "WV-2024-0010", client: "Fatima Zahra", type: "Work Visa", country: "Canada", status: "submitted", date: "2024-03-10", paid: true },
  { id: "SV-2024-0007", client: "James Okonkwo", type: "Study Visa", country: "Germany", status: "approved", date: "2024-03-08", paid: true },
  { id: "WV-2024-0009", client: "Ana Rodriguez", type: "Work Visa", country: "Canada", status: "new", date: "2024-03-06", paid: false },
  { id: "SV-2024-0006", client: "Liu Wei", type: "Study Visa", country: "Australia", status: "waiting_decision", date: "2024-02-28", paid: true },
  { id: "WV-2024-0008", client: "Ahmed Hassan", type: "Work Visa", country: "UK", status: "pending_payment", date: "2024-02-25", paid: false },
];

function ApplicationsPage() {
  return (
    <div className="flex min-h-screen bg-surface">
      <AgentSidebar />
      <div className="flex flex-1 flex-col">
        <AgentHeader />
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground">All Applications</h1>
            <p className="text-sm text-muted-foreground">{applications.length} total applications</p>
          </div>

          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by reference, client, or country..." className="pl-9" />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" /> Filter
            </Button>
          </div>

          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="p-4 font-medium">Reference</th>
                      <th className="p-4 font-medium">Client</th>
                      <th className="p-4 font-medium hidden sm:table-cell">Type</th>
                      <th className="p-4 font-medium hidden md:table-cell">Country</th>
                      <th className="p-4 font-medium">Status</th>
                      <th className="p-4 font-medium hidden lg:table-cell">Payment</th>
                      <th className="p-4 font-medium hidden lg:table-cell">Date</th>
                      <th className="p-4 font-medium w-12"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((app) => (
                      <tr key={app.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="p-4 font-medium text-primary">{app.id}</td>
                        <td className="p-4">{app.client}</td>
                        <td className="p-4 hidden sm:table-cell">{app.type}</td>
                        <td className="p-4 hidden md:table-cell">{app.country}</td>
                        <td className="p-4"><StatusBadge status={app.status} /></td>
                        <td className="p-4 hidden lg:table-cell">
                          <span className={`text-xs font-medium ${app.paid ? "text-green-600" : "text-orange-500"}`}>
                            {app.paid ? "Paid" : "Unpaid"}
                          </span>
                        </td>
                        <td className="p-4 hidden lg:table-cell text-muted-foreground">{app.date}</td>
                        <td className="p-4">
                          <button className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground">
                            <Eye className="h-4 w-4" />
                          </button>
                        </td>
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
