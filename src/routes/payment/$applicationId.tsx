import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Shield, CheckCircle, XCircle, ArrowRight, CreditCard,
  FileText, Globe, User, Clock, AlertTriangle, Sparkles,
  Mail, HelpCircle, MapPin, BadgeCheck, Lock, ChevronDown
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/payment/$applicationId")({
  head: () => ({
    meta: [
      { title: "Complete Your Payment — Global Link Migration Services" },
      { name: "description", content: "Review your application summary and complete your secure payment." },
    ],
  }),
  component: PaymentSummaryPage,
});

const DEFAULT_INCLUDED = [
  "Professional profile review & eligibility assessment",
  "Complete application guidance & form preparation",
  "Personalised document checklist",
  "Step-by-step processing support",
  "Follow-up communication & status updates",
  "Post-submission support until decision",
];

const DEFAULT_NOT_INCLUDED = [
  "Government / embassy / consulate fees",
  "Language test fees (IELTS, TOEFL, etc.)",
  "Travel tickets & accommodation",
  "Health insurance",
  "Third-party notarisation / translation fees",
  "Credential evaluation fees (WES, ECA, etc.)",
];

const STEPS = [
  { label: "Application", done: true },
  { label: "Review & Pay", active: true },
  { label: "Processing", done: false },
  { label: "Decision", done: false },
];

function PaymentSummaryPage() {
  const { applicationId } = Route.useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState<any>(null);
  const [payment, setPayment] = useState<any>(null);
  const [pricing, setPricing] = useState<any>(null);
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    loadData();
  }, [applicationId]);

  async function loadData() {
    try {
      const { data: app, error: appErr } = await supabase
        .from("applications")
        .select("id, reference_number, application_type, destination_country, form_data, status, payment_status, created_at")
        .eq("id", applicationId)
        .single();
      if (appErr) throw appErr;
      setApplication(app);

      const { data: existingPayment } = await supabase
        .from("payments")
        .select("*")
        .eq("application_id", applicationId)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (existingPayment) {
        setPayment(existingPayment);
        if (existingPayment.payment_status === "paid") {
          navigate({ to: "/payment/success", search: { ref: app.reference_number } });
          return;
        }
      }

      // Load pricing
      const { data: pricingData } = await supabase
        .from("pricing")
        .select("*")
        .eq("is_active", true)
        .eq("country", app.destination_country || "")
        .eq("visa_type", app.application_type || "");

      if (pricingData && pricingData.length > 0) {
        setPricing(pricingData[0]);
      }

      // Load linked program for dynamic inclusions
      const formData = app.form_data as Record<string, any> || {};
      if (formData.programId || pricingData?.[0]?.program_id) {
        const progId = formData.programId || pricingData?.[0]?.program_id;
        const { data: prog } = await supabase
          .from("programs")
          .select("name, tagline, processing_time, whats_included, whats_not_included, service_fee, currency")
          .eq("id", progId)
          .maybeSingle();
        if (prog) setProgram(prog);
      }

      // Create payment record if not exists
      if (!existingPayment) {
        const amount = pricingData?.[0]?.base_amount || 350;
        const currency = pricingData?.[0]?.currency || "USD";
        const { data: { user } } = await supabase.auth.getUser();

        const { data: newPayment, error: payErr } = await supabase
          .from("payments")
          .insert({
            application_id: app.id,
            applicant_id: user?.id || null,
            payer_type: "applicant" as any,
            country: app.destination_country,
            visa_type: app.application_type,
            service_type: app.application_type,
            amount: amount,
            currency: currency,
            internal_reference: "",
          } as any)
          .select("*")
          .single();
        if (!payErr && newPayment) {
          setPayment(newPayment);
        }
      }
    } catch (err) {
      console.error("Failed to load payment data:", err);
      toast.error("Unable to load payment details.");
    } finally {
      setLoading(false);
    }
  }

  function handleProceedToPayment() {
    setProcessing(true);
    const whopProductId = pricing?.whop_product_id;
    const checkoutRef = payment?.internal_reference || "";

    if (whopProductId) {
      const whopUrl = `https://whop.com/checkout/${whopProductId}/?metadata[payment_ref]=${checkoutRef}&metadata[application_id]=${applicationId}`;
      window.open(whopUrl, "_blank");
    } else {
      toast.info("Payment checkout will be configured by the admin. Please contact support for payment instructions.");
    }
    setProcessing(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading payment details…</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="max-w-md text-center">
          <AlertTriangle className="mx-auto h-12 w-12 text-destructive" />
          <h1 className="mt-4 text-xl font-bold">Application Not Found</h1>
          <p className="mt-2 text-sm text-muted-foreground">We couldn't find this application. Please check the link and try again.</p>
          <Link to="/"><Button className="mt-4">Go Home</Button></Link>
        </div>
      </div>
    );
  }

  const formData = application.form_data as Record<string, any> || {};
  const applicantName = formData.fullName || formData.full_name || "Applicant";
  const applicantEmail = formData.email || "";
  const amount = payment?.amount || pricing?.base_amount || program?.service_fee || 350;
  const currency = payment?.currency || pricing?.currency || program?.currency || "USD";
  const serviceName = program?.name || application.application_type?.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase()) || "Visa Service";
  const processingTime = program?.processing_time || "2–8 weeks";

  const included: string[] = (program?.whats_included && Array.isArray(program.whats_included) && program.whats_included.length > 0)
    ? (program.whats_included as string[])
    : DEFAULT_INCLUDED;
  const notIncluded: string[] = (program?.whats_not_included && Array.isArray(program.whats_not_included) && program.whats_not_included.length > 0)
    ? (program.whats_not_included as string[])
    : DEFAULT_NOT_INCLUDED;

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <span className="text-sm font-bold">Global Link Migration</span>
          </Link>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3.5 w-3.5 text-gold" />
            <span>Secure Checkout</span>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="border-b border-border bg-card/50">
        <div className="mx-auto flex max-w-3xl items-center justify-center gap-0 px-4 py-3">
          {STEPS.map((s, i) => (
            <div key={s.label} className="flex items-center">
              <div className="flex items-center gap-1.5">
                <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                  s.done ? "bg-green-600 text-white" : s.active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {s.done ? <CheckCircle className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span className={`hidden text-xs font-medium sm:inline ${s.active ? "text-foreground" : "text-muted-foreground"}`}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`mx-2 h-px w-6 sm:w-10 ${s.done ? "bg-green-600" : "bg-border"}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          {/* Title */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold md:text-3xl">Review & Pay</h1>
            <p className="mt-1 text-sm text-muted-foreground">Please review your application details before completing payment</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            {/* Left column — details */}
            <div className="space-y-5">
              {/* Application Summary */}
              <Card className="overflow-hidden">
                <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-5 py-3">
                  <FileText className="h-4 w-4 text-primary" />
                  <h2 className="text-sm font-bold">Application Details</h2>
                </div>
                <CardContent className="p-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <InfoRow icon={User} label="Applicant" value={applicantName} />
                    <InfoRow icon={FileText} label="Reference" value={application.reference_number} highlight />
                    <InfoRow icon={MapPin} label="Destination" value={application.destination_country || "TBD"} />
                    <InfoRow icon={FileText} label="Service" value={serviceName} />
                    <InfoRow icon={Clock} label="Processing Time" value={processingTime} />
                    <InfoRow icon={Clock} label="Submitted" value={new Date(application.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })} />
                  </div>
                  {applicantEmail && (
                    <p className="mt-3 text-xs text-muted-foreground">Confirmation will be sent to <strong>{applicantEmail}</strong></p>
                  )}
                </CardContent>
              </Card>

              {/* Included / Not Included */}
              <div className="grid gap-5 sm:grid-cols-2">
                <Card>
                  <CardContent className="p-5">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold">
                      <BadgeCheck className="h-4 w-4 text-green-600" />
                      What's Included
                    </h3>
                    <ul className="space-y-2">
                      {included.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-500" />
                          {typeof item === "string" ? item : String(item)}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-5">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold">
                      <XCircle className="h-4 w-4 text-muted-foreground" />
                      Not Included
                    </h3>
                    <ul className="space-y-2">
                      {notIncluded.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/40" />
                          {typeof item === "string" ? item : String(item)}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>

              {/* After Payment */}
              <Collapsible defaultOpen>
                <Card>
                  <CollapsibleTrigger className="flex w-full items-center justify-between px-5 py-4 text-left">
                    <h3 className="flex items-center gap-2 text-sm font-bold">
                      <Sparkles className="h-4 w-4 text-gold" />
                      What Happens After Payment
                    </h3>
                    <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform data-[state=open]:rotate-180" />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <CardContent className="px-5 pb-5 pt-0">
                      <div className="space-y-3">
                        {[
                          { step: "1", text: "Instant payment confirmation & receipt" },
                          { step: "2", text: "Expert team reviews your application within 24 hours" },
                          { step: "3", text: "Personalised document checklist delivered to your email" },
                          { step: "4", text: "Dedicated case officer contacts you directly" },
                          { step: "5", text: "Full visa processing begins with ongoing support" },
                        ].map(({ step, text }) => (
                          <div key={step} className="flex items-start gap-3">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/10 text-xs font-bold text-gold">{step}</span>
                            <p className="text-sm text-muted-foreground">{text}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </CollapsibleContent>
                </Card>
              </Collapsible>

              {/* Disclaimer */}
              <Card className="border-amber-200/60 bg-amber-50/30">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    <p className="text-xs leading-relaxed text-amber-800">
                      <strong>Disclaimer:</strong> We provide professional visa application support services.
                      Final visa decisions are made solely by embassies, consulates, and immigration authorities.
                      Payment covers our professional services only.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right column — payment card (sticky) */}
            <div className="lg:sticky lg:top-6 lg:self-start">
              <Card className="border-2 border-gold/30 shadow-lg">
                <CardContent className="p-6">
                  <h3 className="text-center text-sm font-bold text-muted-foreground">Order Summary</h3>
                  <Separator className="my-4" />

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">{serviceName}</span>
                      <span className="font-medium">${Number(amount).toFixed(2)}</span>
                    </div>
                    {program?.tagline && (
                      <p className="text-xs text-muted-foreground">{program.tagline}</p>
                    )}
                  </div>

                  <Separator className="my-4" />

                  <div className="flex items-center justify-between">
                    <span className="font-bold">Total</span>
                    <div className="text-right">
                      <span className="text-2xl font-bold">${Number(amount).toFixed(2)}</span>
                      <p className="text-xs text-muted-foreground">{currency} • One-time</p>
                    </div>
                  </div>

                  <Button
                    size="lg"
                    variant="gold"
                    className="mt-5 w-full gap-2 text-base"
                    onClick={handleProceedToPayment}
                    disabled={processing}
                  >
                    {processing ? "Preparing…" : (
                      <>Pay Now <ArrowRight className="h-4 w-4" /></>
                    )}
                  </Button>

                  <div className="mt-4 flex flex-col items-center gap-2 text-[11px] text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><Lock className="h-3 w-3 text-gold" /> 256-bit SSL</span>
                      <span className="flex items-center gap-1"><Shield className="h-3 w-3 text-gold" /> Secure</span>
                    </div>
                    <span>Powered by Whop · Instant confirmation</span>
                  </div>
                </CardContent>
              </Card>

              {/* Need Help */}
              <div className="mt-4 rounded-xl border border-border bg-card p-4 text-center">
                <p className="text-xs font-medium text-foreground">Need help?</p>
                <a href="mailto:support@globallinkmigration.com" className="mt-1 flex items-center justify-center gap-1 text-xs text-primary hover:underline">
                  <Mail className="h-3 w-3" /> support@globallinkmigration.com
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value, highlight }: { icon: any; label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-4 w-4 text-muted-foreground" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={`text-sm font-semibold ${highlight ? "text-primary" : ""}`}>{value}</p>
      </div>
    </div>
  );
}
