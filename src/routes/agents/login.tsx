import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Globe, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/agents/login")({
  head: () => ({
    meta: [
      { title: "Agent Login — Global Link Migration Services" },
      { name: "description", content: "Sign in to the agent portal to manage client applications." },
    ],
  }),
  component: AgentLoginPage,
});

function AgentLoginPage() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary mb-4">
            <Globe className="h-6 w-6 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Agent Portal</h1>
          <p className="mt-1 text-sm text-muted-foreground">Sign in to manage your clients</p>
        </div>

        <div className="card-premium p-6">
          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              navigate({ to: "/agents/dashboard" });
            }}
          >
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input type="email" placeholder="agent@company.com" required />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Password</Label>
                <Link to="/agents/register" className="text-xs font-medium text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
              <Input type="password" placeholder="Enter your password" required />
            </div>
            <Button type="submit" size="lg" className="w-full">
              Sign In <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Not registered yet?{" "}
          <Link to="/agents/register" className="font-medium text-primary hover:underline">
            Register as Agent
          </Link>
        </p>
        <p className="mt-4 text-center">
          <Link to="/" className="text-xs text-muted-foreground hover:text-foreground">
            ← Back to main site
          </Link>
        </p>
      </div>
    </div>
  );
}
