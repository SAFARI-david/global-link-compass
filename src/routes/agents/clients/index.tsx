import { createFileRoute, Link } from "@tanstack/react-router";
import { Plus, Search, Filter, MoreHorizontal } from "lucide-react";
import { AgentSidebar } from "@/components/agent/AgentSidebar";
import { AgentHeader } from "@/components/agent/AgentHeader";
import { StatusBadge } from "@/components/agent/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/agents/clients/")({
  head: () => ({
    meta: [
      { title: "My Clients — Agent Portal" },
      { name: "description", content: "Manage your client list." },
    ],
  }),
  component: ClientsPage,
});

const clients = [
  { id: "C001", name: "Mohammed Al-Rashid", email: "m.rashid@email.com", country: "Saudi Arabia", applications: 2, latestStatus: "under_review", joined: "2024-01-15" },
  { id: "C002", name: "Priya Sharma", email: "priya.s@email.com", country: "India", applications: 1, latestStatus: "pending_documents", joined: "2024-02-03" },
  { id: "C003", name: "David Chen", email: "d.chen@email.com", country: "China", applications: 3, latestStatus: "in_progress", joined: "2023-11-20" },
  { id: "C004", name: "Fatima Zahra", email: "f.zahra@email.com", country: "Morocco", applications: 1, latestStatus: "submitted", joined: "2024-02-20" },
  { id: "C005", name: "James Okonkwo", email: "j.okonkwo@email.com", country: "Nigeria", applications: 2, latestStatus: "approved", joined: "2023-10-05" },
  { id: "C006", name: "Ana Rodriguez", email: "ana.r@email.com", country: "Colombia", applications: 1, latestStatus: "new", joined: "2024-03-10" },
];

function ClientsPage() {
  return (
    <div className="flex min-h-screen bg-surface">
      <AgentSidebar />
      <div className="flex flex-1 flex-col">
        <AgentHeader />
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">My Clients</h1>
              <p className="text-sm text-muted-foreground">{clients.length} registered clients</p>
            </div>
            <Link to="/agents/clients/new">
              <Button variant="gold">
                <Plus className="mr-2 h-4 w-4" /> Add New Client
              </Button>
            </Link>
          </div>

          {/* Filters */}
          <div className="mb-4 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search by name, email, or ID..." className="pl-9" />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" /> Filter
            </Button>
          </div>

          {/* Client Cards */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {clients.map((client) => (
              <Card key={client.id} className="group cursor-pointer transition-shadow hover:shadow-md">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                        {client.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">{client.name}</h3>
                        <p className="text-xs text-muted-foreground">{client.email}</p>
                      </div>
                    </div>
                    <button className="rounded-md p-1 text-muted-foreground hover:bg-muted">
                      <MoreHorizontal className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{client.country}</span>
                    <StatusBadge status={client.latestStatus} />
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-3 text-xs text-muted-foreground">
                    <span>{client.applications} application{client.applications !== 1 ? "s" : ""}</span>
                    <span>Since {client.joined}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
