import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, BookOpen, Users, FileText, CreditCard, Shield, ArrowRight } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/admin/guide")({
  head: () => ({ meta: [{ title: "Admin Setup Guide — Global Link" }] }),
  component: AdminGuidePage,
});

const steps: { n: number; title: string; desc: string; to?: string; cta?: string }[] = [
  { n: 1, title: "Add programs / services", desc: "Create the country, visa type, full description, requirements, documents, process steps, and pricing for each program. This is the core of the catalog users see.", to: "/admin/programs", cta: "Open Programs" },
  { n: 2, title: "Set service pricing", desc: "Confirm or override base pricing per program. Programs without a price will not appear in checkout.", to: "/admin/pricing", cta: "Open Pricing" },
  { n: 3, title: "Publish jobs", desc: "Add open job opportunities (employer, location, salary, requirements). Jobs are shown on /jobs and the homepage.", to: "/admin/jobs", cta: "Open Jobs" },
  { n: 4, title: "Add FAQs & testimonials", desc: "FAQs and testimonials are managed per program (inside the Program editor → FAQs section). Add at least 3 FAQs and 1 testimonial per program for trust.", to: "/admin/programs", cta: "Edit a Program" },
  { n: 5, title: "Invite agents", desc: "Agents register at /agents/register. Approve them and assign client applications from the Agents tab.", to: "/admin/agents", cta: "Open Agents" },
  { n: 6, title: "Review applications", desc: "Every submission lands here. Update status (under review → in progress → approved), add admin notes, and assign an agent.", to: "/admin/applications", cta: "Open Applications" },
  { n: 7, title: "Verify payments", desc: "Once an applicant pays, the status flips to 'paid' automatically. Manually verify and approve commissions for the linked agent.", to: "/admin/payments", cta: "Open Payments" },
  { n: 8, title: "Approve commissions", desc: "Commissions are auto-created on paid applications. Review the percentage, approve, and mark as paid out.", to: "/admin/commissions", cta: "Open Commissions" },
];

function AdminGuidePage() {
  return (
    <div className="flex min-h-screen bg-surface">
      <AdminSidebar />
      <div className="flex flex-1 flex-col">
        <AdminHeader title="Admin Setup Guide" />
        <div className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="mx-auto max-w-4xl space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-gold" />
                  <CardTitle>How the platform works</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>Global Link Migration runs on three flows:</p>
                <div className="grid gap-3 md:grid-cols-3">
                  <div className="rounded-lg border bg-card p-4">
                    <Shield className="mb-2 h-5 w-5 text-gold" />
                    <p className="font-semibold text-foreground">Admin (you)</p>
                    <p className="text-xs">Build the catalog: programs, prices, jobs. Review applications & payments.</p>
                  </div>
                  <div className="rounded-lg border bg-card p-4">
                    <Users className="mb-2 h-5 w-5 text-gold" />
                    <p className="font-semibold text-foreground">Applicant</p>
                    <p className="text-xs">Browses programs → submits an application → pays → tracks status in their dashboard.</p>
                  </div>
                  <div className="rounded-lg border bg-card p-4">
                    <FileText className="mb-2 h-5 w-5 text-gold" />
                    <p className="font-semibold text-foreground">Agent</p>
                    <p className="text-xs">Registers, submits applications on behalf of clients, earns commission on paid applications.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommended setup order</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  {steps.map((s) => (
                    <li key={s.n} className="flex gap-4 rounded-lg border bg-card p-4">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/10 text-sm font-bold text-gold">
                        {s.n}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{s.title}</p>
                        <p className="mt-1 text-sm text-muted-foreground">{s.desc}</p>
                        {s.to && (
                          <Link to={s.to} className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                            {s.cta} <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <CreditCard className="h-5 w-5 text-gold" />
                  <CardTitle>How payment connects to applications</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-muted-foreground">
                <p className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" /> Applicant picks a program → submits the application → a record with a reference number is created (status: <code className="text-foreground">submitted</code>, payment: <code className="text-foreground">unpaid</code>).</p>
                <p className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" /> Applicant proceeds to payment, which is linked to that exact application via <code className="text-foreground">application_id</code> and the program's pricing.</p>
                <p className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" /> When payment status flips to <code className="text-foreground">paid</code>, the application auto-moves to <code className="text-foreground">under_review</code>.</p>
                <p className="flex items-start gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-600" /> If an agent submitted the application, a commission record is auto-created at the configured % rate.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Test accounts</CardTitle>
              </CardHeader>
              <CardContent className="text-sm">
                <table className="w-full">
                  <thead className="text-left text-muted-foreground">
                    <tr><th className="pb-2 font-medium">Role</th><th className="pb-2 font-medium">Email</th><th className="pb-2 font-medium">Password</th></tr>
                  </thead>
                  <tbody className="font-mono text-xs">
                    <tr><td className="py-1">Admin</td><td>admin@demo.com</td><td>Demo1234!</td></tr>
                    <tr><td className="py-1">Agent</td><td>agent@demo.com</td><td>Demo1234!</td></tr>
                    <tr><td className="py-1">Applicant</td><td>applicant@demo.com</td><td>Demo1234!</td></tr>
                  </tbody>
                </table>
                <p className="mt-3 text-xs text-muted-foreground">⚠️ Remove the demo banner from <code>/login</code> and rotate these passwords before going live.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
