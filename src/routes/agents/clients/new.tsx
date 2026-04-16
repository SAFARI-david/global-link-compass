import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { AgentSidebar } from "@/components/agent/AgentSidebar";
import { AgentHeader } from "@/components/agent/AgentHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const Route = createFileRoute("/agents/clients/new")({
  head: () => ({
    meta: [{ title: "Add New Client — Agent Portal" }],
  }),
  component: NewClientPage,
});

function NewClientPage() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);

  if (saved) {
    return (
      <div className="flex min-h-screen bg-surface">
        <AgentSidebar />
        <div className="flex flex-1 flex-col">
          <AgentHeader />
          <div className="flex flex-1 items-center justify-center p-6">
            <div className="max-w-sm text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-7 w-7 text-green-600" />
              </div>
              <h2 className="text-xl font-bold">Client Added</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                You can now submit applications on behalf of this client.
              </p>
              <div className="mt-6 flex gap-3 justify-center">
                <Button variant="outline" onClick={() => navigate({ to: "/agents/clients" })}>
                  View Clients
                </Button>
                <Button variant="gold" onClick={() => navigate({ to: "/agents/applications/work-visa" })}>
                  Submit Application
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-surface">
      <AgentSidebar />
      <div className="flex flex-1 flex-col">
        <AgentHeader />
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Link to="/agents/clients" className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Back to Clients
          </Link>

          <div className="mx-auto max-w-2xl">
            <h1 className="text-2xl font-bold text-foreground">Add New Client</h1>
            <p className="mt-1 text-sm text-muted-foreground">Register a new client to submit applications on their behalf.</p>

            <form className="mt-6 space-y-6" onSubmit={(e) => { e.preventDefault(); setSaved(true); }}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Personal Information</CardTitle>
                  <CardDescription>Basic client details</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>First Name</Label>
                    <Input placeholder="First name" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Last Name</Label>
                    <Input placeholder="Last name" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input type="email" placeholder="client@email.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input type="tel" placeholder="+1 (555) 000-0000" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Date of Birth</Label>
                    <Input type="date" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Nationality</Label>
                    <Input placeholder="Nationality" required />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Passport Details</CardTitle>
                  <CardDescription>Travel document information</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-5 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Passport Number</Label>
                    <Input placeholder="Passport number" />
                  </div>
                  <div className="space-y-2">
                    <Label>Passport Expiry Date</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Country of Residence</Label>
                    <Input placeholder="Current country of residence" required />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Notes</CardTitle>
                  <CardDescription>Any additional information about this client</CardDescription>
                </CardHeader>
                <CardContent>
                  <textarea
                    className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring min-h-[80px]"
                    placeholder="Optional notes..."
                  />
                </CardContent>
              </Card>

              <div className="flex justify-end gap-3">
                <Button variant="outline" type="button" onClick={() => navigate({ to: "/agents/clients" })}>
                  Cancel
                </Button>
                <Button variant="gold" type="submit">
                  Add Client
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
