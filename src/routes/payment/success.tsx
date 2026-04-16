import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Globe, Shield, Mail, Clock, FileText, User, Copy, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export const Route = createFileRoute("/payment/success")({
  head: () => ({
    meta: [
      { title: "Payment Confirmed — Global Link Migration Services" },
      { name: "description", content: "Your payment has been received. Our team will begin processing your application." },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    ref: (search.ref as string) || "",
  }),
  component: PaymentSuccessPage,
});

const TIMELINE = [
  { label: "Payment Received", status: "done", time: "Just now" },
  { label: "Application Under Review", status: "active", time: "Within 24 hours" },
  { label: "Document Checklist Sent", status: "upcoming", time: "1–2 business days" },
  { label: "Case Officer Assigned", status: "upcoming", time: "2–3 business days" },
  { label: "Processing Begins", status: "upcoming", time: "3–5 business days" },
];

function PaymentSuccessPage() {
  const { ref } = Route.useSearch();

  function copyRef() {
    if (ref) {
      navigator.clipboard.writeText(ref);
      toast.success("Reference copied to clipboard");
    }
  }

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
            <span>Payment Confirmed</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-10 md:py-16">
        {/* Success Hero */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100"
          >
            <CheckCircle className="h-10 w-10 text-green-600" />
          </motion.div>

          <h1 className="mt-5 text-2xl font-bold md:text-3xl">Payment Confirmed</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Thank you! Your payment has been received and your application is now being processed.
          </p>

          {ref && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-5"
            >
              <Card className="mx-auto inline-flex max-w-sm overflow-hidden border-primary/20">
                <CardContent className="flex items-center gap-3 px-5 py-3">
                  <FileText className="h-4 w-4 text-primary" />
                  <div className="text-left">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">Your Reference</p>
                    <p className="text-base font-bold text-primary">{ref}</p>
                  </div>
                  <button onClick={copyRef} className="ml-2 rounded-md p-1.5 hover:bg-muted transition-colors" title="Copy reference">
                    <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                  </button>
                </CardContent>
              </Card>
              <p className="mt-2 text-xs text-muted-foreground">Save this reference for your records</p>
            </motion.div>
          )}
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-10"
        >
          <Card className="overflow-hidden">
            <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-5 py-3">
              <Clock className="h-4 w-4 text-primary" />
              <h2 className="text-sm font-bold">Application Timeline</h2>
            </div>
            <CardContent className="p-5">
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Progress</span>
                  <span>20% — Payment received</span>
                </div>
                <Progress value={20} className="mt-1.5 h-2" />
              </div>

              <div className="space-y-0">
                {TIMELINE.map((item, i) => (
                  <div key={item.label} className="flex items-start gap-3">
                    {/* Vertical line + dot */}
                    <div className="flex flex-col items-center">
                      <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                        item.status === "done" ? "bg-green-600 text-white" :
                        item.status === "active" ? "bg-primary text-primary-foreground animate-pulse" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {item.status === "done" ? <CheckCircle className="h-3.5 w-3.5" /> : <span className="text-xs font-bold">{i + 1}</span>}
                      </div>
                      {i < TIMELINE.length - 1 && (
                        <div className={`w-px flex-1 min-h-[24px] ${item.status === "done" ? "bg-green-600" : "bg-border"}`} />
                      )}
                    </div>
                    <div className="pb-5">
                      <p className={`text-sm font-semibold ${item.status === "done" ? "text-green-700" : item.status === "active" ? "text-foreground" : "text-muted-foreground"}`}>
                        {item.label}
                      </p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-5"
        >
          <Card>
            <CardContent className="p-5">
              <h2 className="mb-4 text-sm font-bold">What You Should Do Now</h2>
              <div className="space-y-3">
                {[
                  { icon: Mail, text: "Check your email for the payment receipt and confirmation" },
                  { icon: FileText, text: "Prepare your documents — we'll send a personalised checklist soon" },
                  { icon: User, text: "Complete your profile if you haven't already" },
                  { icon: Clock, text: "Wait for your case officer to reach out within 24 hours" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gold/10">
                      <Icon className="h-3.5 w-3.5 text-gold" />
                    </div>
                    <p className="text-sm text-muted-foreground">{text}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Contact timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="mt-5 border-gold/20 bg-gold/5">
            <CardContent className="p-4 text-center">
              <p className="text-sm font-semibold">
                ⏱ Our team will contact you within <strong>24 hours</strong>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                You'll receive updates via email and your dashboard
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
        >
          <Link to="/dashboard">
            <Button size="lg" className="gap-2">
              Go to Dashboard <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <a href="mailto:support@globallinkmigration.com">
            <Button variant="outline" size="lg" className="gap-2">
              <Mail className="h-4 w-4" /> Contact Support
            </Button>
          </a>
        </motion.div>

        {/* Footer Support */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>Questions? Reach us at <a href="mailto:support@globallinkmigration.com" className="text-primary underline">support@globallinkmigration.com</a></p>
        </div>
      </div>
    </div>
  );
}
