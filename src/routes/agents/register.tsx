import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Globe, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/agents/register")({
  head: () => ({
    meta: [
      { title: "Register as Agent — Global Link Migration Services" },
      { name: "description", content: "Register as an agent partner to manage client visa applications." },
    ],
  }),
  component: AgentRegisterPage,
});

function AgentRegisterPage() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface px-4">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Registration Submitted</h1>
          <p className="mt-3 text-muted-foreground">
            Thank you for registering. Our team will review your application and contact you within 48 hours.
          </p>
          <Link to="/" className="mt-6 inline-block">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left panel */}
      <div className="hidden w-1/2 bg-navy-gradient lg:flex lg:flex-col lg:justify-between lg:p-12">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold">
            <Globe className="h-5 w-5 text-gold-foreground" />
          </div>
          <span className="text-sm font-bold text-white">Global Link Migration</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-white">Partner with us</h2>
          <p className="mt-4 text-lg text-white/70">
            Submit and manage client applications, track statuses, and grow your immigration consultancy business.
          </p>
          <ul className="mt-8 space-y-4">
            {[
              "Submit work & study visa applications",
              "Real-time status tracking",
              "Dedicated agent support",
              "Commission tracking & payments",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-white/80">
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-gold" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-xs text-white/40">© 2024 Global Link Migration Services</p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden">
            <div className="flex items-center gap-2.5 mb-6">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Globe className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-sm font-bold">Global Link Migration</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-foreground">Agent Registration</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Already registered?{" "}
            <Link to="/agents/login" className="font-medium text-primary hover:underline">Sign in</Link>
          </p>
          <form
            className="mt-8 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input placeholder="John" required />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input placeholder="Doe" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Company / Agency Name</Label>
              <Input placeholder="Your company name" required />
            </div>
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input type="email" placeholder="agent@company.com" required />
            </div>
            <div className="space-y-2">
              <Label>Phone Number</Label>
              <Input type="tel" placeholder="+1 (555) 000-0000" required />
            </div>
            <div className="space-y-2">
              <Label>Country</Label>
              <Input placeholder="Country of operation" required />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" placeholder="Create a strong password" required />
            </div>
            <div className="space-y-2">
              <Label>Confirm Password</Label>
              <Input type="password" placeholder="Confirm password" required />
            </div>
            <div className="flex items-start gap-2">
              <input type="checkbox" id="terms" className="mt-1 h-4 w-4 rounded border-input" required />
              <label htmlFor="terms" className="text-sm text-muted-foreground">
                I agree to the{" "}
                <Link to="/terms" className="font-medium text-primary hover:underline">Terms of Service</Link>
                {" "}and{" "}
                <Link to="/privacy" className="font-medium text-primary hover:underline">Privacy Policy</Link>
              </label>
            </div>
            <Button type="submit" variant="gold" size="lg" className="w-full">
              Register as Agent <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
