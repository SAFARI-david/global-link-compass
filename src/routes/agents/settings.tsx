import { createFileRoute } from "@tanstack/react-router";
import { AgentSidebar } from "@/components/agent/AgentSidebar";
import { AgentHeader } from "@/components/agent/AgentHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const Route = createFileRoute("/agents/settings")({
  head: () => ({ meta: [{ title: "Settings — Agent Portal" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="flex min-h-screen bg-surface">
      <AgentSidebar />
      <div className="flex flex-1 flex-col">
        <AgentHeader />
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <h1 className="mb-6 text-2xl font-bold text-foreground">Account Settings</h1>
          <div className="mx-auto max-w-2xl space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Profile Information</CardTitle>
                <CardDescription>Update your agent profile details</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2"><Label>First Name</Label><Input defaultValue="Agent" /></div>
                <div className="space-y-2"><Label>Last Name</Label><Input defaultValue="Demo" /></div>
                <div className="space-y-2"><Label>Company</Label><Input defaultValue="Demo Agency Ltd" /></div>
                <div className="space-y-2"><Label>Phone</Label><Input defaultValue="+1 (555) 000-0000" /></div>
                <div className="space-y-2 sm:col-span-2"><Label>Email</Label><Input type="email" defaultValue="agent@example.com" /></div>
                <div className="sm:col-span-2 flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Change Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2"><Label>Current Password</Label><Input type="password" /></div>
                <div className="space-y-2"><Label>New Password</Label><Input type="password" /></div>
                <div className="space-y-2"><Label>Confirm New Password</Label><Input type="password" /></div>
                <div className="flex justify-end"><Button variant="outline">Update Password</Button></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
