import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  FileText, CreditCard, Clock, CheckCircle, XCircle, AlertTriangle,
  ArrowRight, Globe, Shield, Eye, Loader2, Plus, RefreshCw,
  Search, ArrowUpDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DocumentUpload } from "@/components/DocumentUpload";
import { ApplicationProgress } from "@/components/ApplicationProgress";
import { ApplicationTimeline } from "@/components/ApplicationTimeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { getUserApplications, getUserPayments } from "@/lib/dashboard.functions";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "My Dashboard — Global Link Migration Services" },
      { name: "description", content: "Track your applications, payments, and next steps." },
    ],
  }),
  component: UserDashboardPage,
});

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof CheckCircle }> = {
  submitted: { label: "Submitted", color: "bg-amber-100 text-amber-700", icon: Clock },
  under_review: { label: "Under Review", color: "bg-blue-100 text-blue-700", icon: Eye },
  in_progress: { label: "In Progress", color: "bg-indigo-100 text-indigo-700", icon: RefreshCw },
  pending_documents: { label: "Documents Needed", color: "bg-orange-100 text-orange-700", icon: AlertTriangle },
  approved: { label: "Approved", color: "bg-green-100 text-green-700", icon: CheckCircle },
  rejected: { label: "Rejected", color: "bg-red-100 text-red-700", icon: XCircle },
};

const PAYMENT_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  unpaid: { label: "Unpaid", color: "bg-muted text-muted-foreground" },
  pending: { label: "Pending", color: "bg-amber-100 text-amber-700" },
  paid: { label: "Paid", color: "bg-green-100 text-green-700" },
  failed: { label: "Failed", color: "bg-red-100 text-red-700" },
  refunded: { label: "Refunded", color: "bg-purple-100 text-purple-700" },
  pending_verification: { label: "Verifying", color: "bg-blue-100 text-blue-700" },
};

function getNextStep(app: any): { text: string; action?: string; link?: string } {
  if (app.payment_status === "unpaid" || app.payment_status === "pending") {
    return { text: "Complete your payment to begin processing", action: "Pay Now", link: `/payment/${app.id}` };
  }
  if (app.status === "submitted") {
    return { text: "Your application is queued for review. We'll update you within 24 hours." };
  }
  if (app.status === "under_review") {
    return { text: "Our team is reviewing your application. You'll receive feedback soon." };
  }
  if (app.status === "pending_documents") {
    return { text: "We need additional documents. Check your email for the checklist." };
  }
  if (app.status === "in_progress") {
    return { text: "Your application is being processed. We'll notify you of any updates." };
  }
  if (app.status === "approved") {
    return { text: "Congratulations! Your application has been approved. Check email for next steps." };
  }
  if (app.status === "rejected") {
    return { text: "Unfortunately, your application was not approved. Contact support for options." };
  }
  return { text: "We're working on your application." };
}

function UserDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [docCounts, setDocCounts] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "status">("newest");

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate({ to: "/login", search: { redirect: "/dashboard" } });
      return;
    }
    loadData();
  }, [user, authLoading]);

  async function loadData() {
    setLoading(true);
    try {
      const [appsRes, paysRes] = await Promise.all([
        getUserApplications(),
        getUserPayments(),
      ]);
      setApplications(appsRes.applications);
      setPayments(paysRes.payments);

      // Fetch document counts per application
      if (appsRes.applications.length > 0) {
        const appIds = appsRes.applications.map((a: any) => a.id);
        const { data: docs } = await supabase
          .from("documents")
          .select("application_id")
          .in("application_id", appIds);
        const counts: Record<string, number> = {};
        for (const d of docs || []) {
          counts[d.application_id] = (counts[d.application_id] || 0) + 1;
        }
        setDocCounts(counts);
      }
    } catch (err) {
      console.error("Failed to load dashboard data:", err);
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || loading) {
    return (
      <>
        <Header />
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <Footer />
      </>
    );
  }

  if (!user) return null;

  const STATUS_ORDER = ["pending_documents", "submitted", "under_review", "in_progress", "approved", "rejected"];

  const filteredApplications = useMemo(() => {
    let list = applications.filter((a) => {
      const fd = (a.form_data || {}) as Record<string, any>;
      const name = fd.fullName || fd.full_name || "";
      const matchesSearch = !searchQuery ||
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.reference_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (a.destination_country || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || a.status === statusFilter;
      const matchesType = typeFilter === "all" || a.application_type === typeFilter;
      return matchesSearch && matchesStatus && matchesType;
    });

    list.sort((a, b) => {
      if (sortBy === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status);
    });

    return list;
  }, [applications, searchQuery, statusFilter, typeFilter, sortBy]);

  const activeApps = applications.filter((a) =>
    !["approved", "rejected"].includes(a.status)
  );
  const unpaidApps = applications.filter((a) =>
    a.payment_status === "unpaid" || a.payment_status === "pending"
  );
  const totalPaid = payments
    .filter((p) => p.payment_status === "paid")
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <>
      <Header />
      <div className="section-padding">
        <div className="container-narrow">
          <div className="mx-auto max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              {/* Header */}
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="text-2xl font-bold">My Dashboard</h1>
                  <p className="mt-1 text-sm text-muted-foreground">Track your applications, payments, and next steps</p>
                </div>
                <div className="flex gap-2">
                  <Link to="/apply/work-visa">
                    <Button variant="gold" size="sm"><Plus className="mr-1.5 h-4 w-4" /> New Application</Button>
                  </Link>
                  <Button variant="outline" size="sm" onClick={loadData}>
                    <RefreshCw className="mr-1.5 h-4 w-4" /> Refresh
                  </Button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="mb-8 grid gap-4 sm:grid-cols-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold">{applications.length}</p>
                    <p className="text-xs text-muted-foreground">Total Applications</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-blue-600">{activeApps.length}</p>
                    <p className="text-xs text-muted-foreground">Active</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-amber-600">{unpaidApps.length}</p>
                    <p className="text-xs text-muted-foreground">Awaiting Payment</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <p className="text-2xl font-bold text-green-600">${totalPaid.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground">Total Paid</p>
                  </CardContent>
                </Card>
              </div>

              {/* Urgent Actions */}
              {unpaidApps.length > 0 && (
                <Card className="mb-6 border-amber-200 bg-amber-50/50">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-600" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-amber-800">Action Required: Complete Payment</p>
                        <p className="mt-1 text-xs text-amber-700">
                          {unpaidApps.length} application{unpaidApps.length > 1 ? "s" : ""} need{unpaidApps.length === 1 ? "s" : ""} payment to begin processing.
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {unpaidApps.map((app) => (
                            <Link key={app.id} to="/payment/$applicationId" params={{ applicationId: app.id }}>
                              <Button size="sm" variant="default" className="gap-1.5">
                                Pay {app.reference_number} <ArrowRight className="h-3.5 w-3.5" />
                              </Button>
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Applications List */}
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <FileText className="h-5 w-5" /> My Applications
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {applications.length === 0 ? (
                    <div className="py-8 text-center">
                      <FileText className="mx-auto h-10 w-10 text-muted-foreground/30" />
                      <p className="mt-3 text-sm text-muted-foreground">No applications yet.</p>
                      <div className="mt-4 flex justify-center gap-3">
                        <Link to="/apply/work-visa"><Button variant="default" size="sm">Apply for Work Visa</Button></Link>
                        <Link to="/apply/study"><Button variant="outline" size="sm">Apply for Study Visa</Button></Link>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {applications.map((app) => {
                        const statusConf = STATUS_CONFIG[app.status] || STATUS_CONFIG.submitted;
                        const paymentConf = PAYMENT_STATUS_CONFIG[app.payment_status] || PAYMENT_STATUS_CONFIG.unpaid;
                        const nextStep = getNextStep(app);
                        const formData = (app.form_data || {}) as Record<string, any>;
                        const StatusIcon = statusConf.icon;

                        return (
                          <div key={app.id} className="rounded-xl border bg-card p-4 transition-shadow hover:shadow-md">
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                              <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-sm font-bold text-primary">{app.reference_number}</span>
                                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${statusConf.color}`}>
                                    <StatusIcon className="h-3 w-3" /> {statusConf.label}
                                  </span>
                                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${paymentConf.color}`}>
                                    <CreditCard className="mr-0.5 h-3 w-3" /> {paymentConf.label}
                                  </span>
                                </div>
                                <p className="mt-1 text-sm font-medium">
                                  {app.application_type} — {app.destination_country || "TBD"}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Submitted {new Date(app.created_at).toLocaleDateString()} · Applicant: {formData.fullName || formData.full_name || "—"}
                                </p>
                              </div>
                            </div>

                            {/* Progress Bar */}
                            <ApplicationProgress
                              paymentStatus={app.payment_status}
                              applicationStatus={app.status}
                              documentCount={docCounts[app.id] || 0}
                              paidAt={payments.find((p: any) => p.application_id === app.id && p.payment_status === "paid")?.paid_at}
                              adminNotes={app.admin_notes}
                            />

                            {/* Next Step */}
                            <div className="mt-3 flex items-start gap-2 rounded-lg bg-muted/50 p-3">
                              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                              <div className="flex-1">
                                <p className="text-xs font-semibold text-foreground">Next Step</p>
                                <p className="text-xs text-muted-foreground">{nextStep.text}</p>
                              </div>
                              {nextStep.link && (
                                <Link to={nextStep.link as any}>
                                  <Button size="sm" variant="gold" className="shrink-0 text-xs">
                                    {nextStep.action} <ArrowRight className="ml-1 h-3 w-3" />
                                  </Button>
                                </Link>
                              )}
                            </div>

                            {/* Status Timeline */}
                            <ApplicationTimeline applicationId={app.id} />

                            {/* Documents section */}
                            {app.payment_status === "paid" && (
                              <div className="mt-3">
                                <DocumentUpload
                                  applicationId={app.id}
                                  userId={user.id}
                                  destinationCountry={app.destination_country}
                                  applicationType={app.application_type}
                                />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment History */}
              {payments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <CreditCard className="h-5 w-5" /> Payment History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b text-left text-muted-foreground">
                            <th className="pb-3 pr-4 font-medium">Reference</th>
                            <th className="pb-3 pr-4 font-medium">Service</th>
                            <th className="pb-3 pr-4 font-medium">Amount</th>
                            <th className="pb-3 pr-4 font-medium">Status</th>
                            <th className="pb-3 font-medium hidden sm:table-cell">Date</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payments.map((p) => {
                            const pConf = PAYMENT_STATUS_CONFIG[p.payment_status] || PAYMENT_STATUS_CONFIG.unpaid;
                            return (
                              <tr key={p.id} className="border-b border-border/50 last:border-0">
                                <td className="py-3 pr-4 font-medium text-primary">{p.internal_reference}</td>
                                <td className="py-3 pr-4">{p.service_type || p.visa_type || "—"}</td>
                                <td className="py-3 pr-4 font-semibold">${Number(p.amount).toFixed(2)} <span className="text-xs text-muted-foreground">{p.currency}</span></td>
                                <td className="py-3 pr-4">
                                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${pConf.color}`}>
                                    {pConf.label}
                                  </span>
                                </td>
                                <td className="py-3 hidden sm:table-cell text-muted-foreground">
                                  {p.paid_at ? new Date(p.paid_at).toLocaleDateString() : new Date(p.created_at).toLocaleDateString()}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
