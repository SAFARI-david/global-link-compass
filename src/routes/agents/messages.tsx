import { createFileRoute } from "@tanstack/react-router";
import { Send } from "lucide-react";
import { AgentSidebar } from "@/components/agent/AgentSidebar";
import { AgentHeader } from "@/components/agent/AgentHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/agents/messages")({
  head: () => ({ meta: [{ title: "Messages — Agent Portal" }] }),
  component: MessagesPage,
});

const messages = [
  { id: 1, from: "Admin", text: "Your client Mohammed's work visa application has been moved to 'Under Review'. We will update you shortly.", time: "2 hours ago", unread: true },
  { id: 2, from: "Admin", text: "Please upload the updated passport copy for Priya Sharma's application.", time: "1 day ago", unread: true },
  { id: 3, from: "You", text: "I have submitted David Chen's education certificates. Please confirm receipt.", time: "2 days ago", unread: false },
  { id: 4, from: "Admin", text: "James Okonkwo's study visa application has been approved. Congratulations!", time: "1 week ago", unread: false },
];

function MessagesPage() {
  return (
    <div className="flex min-h-screen bg-surface">
      <AgentSidebar />
      <div className="flex flex-1 flex-col">
        <AgentHeader />
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <h1 className="mb-6 text-2xl font-bold text-foreground">Messages</h1>

          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {messages.map((msg) => (
                  <div key={msg.id} className={`p-4 ${msg.unread ? "bg-primary/5" : ""}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-semibold ${msg.from === "You" ? "text-primary" : "text-foreground"}`}>
                        {msg.from}
                        {msg.unread && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-primary" />}
                      </span>
                      <span className="text-xs text-muted-foreground">{msg.time}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{msg.text}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="mt-4">
            <CardContent className="p-4">
              <form className="flex gap-3" onSubmit={(e) => e.preventDefault()}>
                <Input placeholder="Type a message to admin..." className="flex-1" />
                <Button type="submit" className="gap-2">
                  <Send className="h-4 w-4" /> Send
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
