import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Shield, CheckCircle, XCircle, ArrowRight, CreditCard,
  FileText, Globe, User, Clock, AlertTriangle, Sparkles,
  Phone, Mail, HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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

const INCLUDED = [
  "Professional profile review & eligibility assessment",
  "Complete application guidance & form preparation",
  "Personalised document checklist",
  "Step-by-step processing support",
  "Follow-up communication & status updates",
  "Post-submission support until decision",
];

const NOT_INCLUDED = [
  "Government / embassy / consulate fees",
  "Language test fees (IELTS, TOEFL, etc.)",
  "Travel tickets & accommodation",
  "Health insurance",
  "Third-party notarisation / translation fees",
  "Credential evaluation fees (WES, ECA, etc.)",
];

function PaymentSummaryPage() {
  const { applicationId } = Route.useParams();
  const navigate = useNavigate();
  const [application, setApplication] = useState<any>(null);
  const [payment, setPayment] = useState<any>(null);
  const [pricing, setPricing] = useState<any>(null);
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

      // Check for existing payment
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
    // Build Whop checkout URL with metadata
    const whopProductId = pricing?.whop_product_id;
    const checkoutRef = payment?.internal_reference || "";

    if (whopProductId) {
      // Redirect to Whop hosted checkout
      const whopUrl = `https://whop.com/checkout/${whopProductId}/?metadata[payment_ref]=${checkoutRef}&metadata[application_id]=${applicationId}`;
      window.open(whopUrl, "_blank");
    } else {
      // Fallback: use a configured checkout link or show instructions
      toast.info("Payment checkout will be configured by the admin. Please contact support for payment instructions.");
    }
    setProcessing(false);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading payment details...</p>
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
  const amount = payment?.amount || pricing?.base_amount || 350;
  const currency = payment?.currency || pricing?.currency || "USD";

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
            <Shield className="h-3.5 w-3.5 text-gold" />
            <span>Secure Payment</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 md:py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          {/* Title */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
              <CreditCard className="h-7 w-7 text-gold" />
            </div>
            <h1 className="text-2xl font-bold md:text-3xl">Complete Your Payment</h1>
            <p className="mt-2 text-sm text-muted-foreground">Review your application summary and proceed to secure checkout</p>
          </div>

          {/* Application Summary Card */}
          <Card className="mb-6 overflow-hidden border-gold/20">
            <div className="bg-navy px-6 py-4">
              <h2 className="text-sm font-bold text-white">Application Summary</h2>
            </div>
            <CardContent className="p-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <User className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Applicant</p>
                    <p className="text-sm font-semibold">{applicantName}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Reference</p>
                    <p className="text-sm font-semibold text-primary">{application.reference_number}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Destination</p>
                    <p className="text-sm font-semibold">{application.destination_country || "To be determined"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Service</p>
                    <p className="text-sm font-semibold">{application.application_type}</p>
                  </div>
                </div>
              </div>

              <Separator className="my-5" />

              {/* Amount */}
              <div className="flex items-center justify-between rounded-xl bg-gold/5 p-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground">Total Amount Due</p>
                  <p className="text-sm text-muted-foreground">Application processing fee</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-foreground">${Number(amount).toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{currency}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What's Included */}
          <div className="mb-6 grid gap-6 md:grid-cols-2">
            <Card>
              <CardContent className="p-5">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  What Your Payment Covers
                </h3>
                <ul className="space-y-2">
                  {INCLUDED.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-5">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-foreground">
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                  Not Included
                </h3>
                <ul className="space-y-2">
                  {NOT_INCLUDED.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground/50" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* What Happens After Payment */}
          <Card className="mb-6">
            <CardContent className="p-5">
              <h3 className="mb-4 flex items-center gap-2 text-sm font-bold">
                <Sparkles className="h-4 w-4 text-gold" />
                What Happens After Payment
              </h3>
              <div className="space-y-3">
                {[
                  { step: "1", text: "Your payment is confirmed instantly and recorded securely" },
                  { step: "2", text: "Our team reviews your application within 24 hours" },
                  { step: "3", text: "You receive your personalised next steps and document checklist" },
                  { step: "4", text: "We contact you by email or dashboard support" },
                  { step: "5", text: "Your visa application process officially begins" },
                ].map(({ step, text }) => (
                  <div key={step} className="flex items-start gap-3">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">{step}</span>
                    <p className="text-sm text-muted-foreground">{text}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Disclaimer */}
          <Card className="mb-6 border-amber-200 bg-amber-50/50">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                <p className="text-xs leading-relaxed text-amber-800">
                  <strong>Important:</strong> We provide professional visa application support and application management services. 
                  Final decisions on visa applications are made solely by embassies, consulates, institutions, employers, and immigration authorities. 
                  Payment covers our professional services only.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment CTA */}
          <div className="rounded-2xl border-2 border-gold/30 bg-card p-6 text-center shadow-lg">
            <Button
              size="lg"
              variant="gold"
              className="w-full max-w-sm text-base"
              onClick={handleProceedToPayment}
              disabled={processing}
            >
              {processing ? "Preparing checkout..." : (
                <>Proceed to Secure Payment <ArrowRight className="ml-2 h-4 w-4" /></>
              )}
            </Button>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Shield className="h-3 w-3 text-gold" /> 256-bit encryption</span>
              <span className="flex items-center gap-1"><Shield className="h-3 w-3 text-gold" /> Secure checkout via Whop</span>
              <span className="flex items-center gap-1"><Shield className="h-3 w-3 text-gold" /> Instant confirmation</span>
            </div>
          </div>

          {/* Support */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-muted-foreground">
            <a href="mailto:support@globallinkmigration.com" className="flex items-center gap-1 hover:text-foreground transition-colors">
              <Mail className="h-3 w-3" /> support@globallinkmigration.com
            </a>
            <span className="flex items-center gap-1">
              <HelpCircle className="h-3 w-3" /> Need help? Contact our team
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
