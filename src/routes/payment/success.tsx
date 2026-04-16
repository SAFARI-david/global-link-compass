import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight, Globe, Shield, Mail, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export const Route = createFileRoute("/payment/success")({
  head: () => ({
    meta: [
      { title: "Payment Received — Global Link Migration Services" },
      { name: "description", content: "Your payment has been received. Our team will begin processing your application." },
    ],
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    ref: (search.ref as string) || "",
  }),
  component: PaymentSuccessPage,
});

function PaymentSuccessPage() {
  const { ref } = Route.useSearch();

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
            <span>Secure</span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-green-100"
          >
            <CheckCircle className="h-12 w-12 text-green-600" />
          </motion.div>

          <h1 className="mt-6 text-3xl font-bold md:text-4xl">Payment Received Successfully</h1>
          <p className="mt-3 text-base text-muted-foreground">
            Your payment has been recorded and your application is now being processed.
          </p>

          {ref && (
            <div className="mt-4 inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              Reference: {ref}
            </div>
          )}
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="mt-8">
            <CardContent className="p-6">
              <h2 className="mb-4 text-lg font-bold">What Happens Next</h2>
              <div className="space-y-4">
                {[
                  { step: "1", title: "Payment Confirmed", desc: "Your payment has been securely recorded in our system." },
                  { step: "2", title: "Application Review", desc: "Our expert team will review your complete application within 24 hours." },
                  { step: "3", title: "Personalised Checklist", desc: "You'll receive a detailed document checklist and next steps tailored to your application." },
                  { step: "4", title: "Direct Contact", desc: "A dedicated case officer will contact you via email or platform support." },
                  { step: "5", title: "Processing Begins", desc: "Your visa application process officially starts with our full support." },
                ].map(({ step, title, desc }) => (
                  <div key={step} className="flex items-start gap-4">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/10 text-sm font-bold text-gold">{step}</span>
                    <div>
                      <p className="text-sm font-semibold">{title}</p>
                      <p className="text-sm text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="mt-4 border-gold/20 bg-gold/5">
            <CardContent className="p-4 text-center">
              <p className="text-sm font-semibold text-foreground">
                ⏱ Our team will contact you within <strong>24 hours</strong>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Check your email for updates and login to your dashboard for real-time status tracking
              </p>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link to="/profile">
              <Button size="lg" className="gap-2">
                View My Dashboard <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <a href="mailto:support@globallinkmigration.com">
              <Button variant="outline" size="lg" className="gap-2">
                <Mail className="h-4 w-4" /> Contact Support
              </Button>
            </a>
          </div>

          {/* Support */}
          <div className="mt-8 text-center text-xs text-muted-foreground">
            <p>Need help? Reach our team at <a href="mailto:support@globallinkmigration.com" className="text-primary underline">support@globallinkmigration.com</a></p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
