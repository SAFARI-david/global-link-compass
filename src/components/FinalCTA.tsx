import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Shield, Clock, CheckCircle2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

const reassurances = [
  { icon: Shield, text: "Application review is free" },
  { icon: Clock, text: "Response within 24 hours" },
  { icon: CreditCard, text: "No payment until you approve" },
  { icon: CheckCircle2, text: "Cancel anytime before processing" },
];

export function FinalCTA() {
  return (
    <section className="section-padding">
      <div className="container-narrow">
        <motion.div
          className="overflow-hidden rounded-2xl bg-navy-gradient"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Trust bar */}
          <div className="border-b border-primary-foreground/10 px-6 py-4">
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {reassurances.map((r) => (
                <span key={r.text} className="flex items-center gap-1.5 text-xs text-primary-foreground/60">
                  <r.icon className="h-3.5 w-3.5 text-gold" />
                  {r.text}
                </span>
              ))}
            </div>
          </div>

          {/* Main CTA */}
          <div className="p-10 text-center md:p-16">
            <h2 className="text-2xl font-extrabold text-primary-foreground md:text-4xl">
              Ready to Start Your Application?
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-primary-foreground/60">
              Submit your details in 15 minutes. Our team reviews your profile, confirms eligibility, 
              and sends you a clear plan — all before any payment is required.
            </p>

            {/* What you get */}
            <div className="mx-auto mt-8 max-w-md rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-gold">What happens when you apply</p>
              <div className="mt-3 space-y-2 text-left text-sm text-primary-foreground/70">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>Free eligibility review within 24 hours</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>Personalized document checklist sent to your email</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>Transparent pricing — full fee breakdown before payment</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                  <span>Dedicated support specialist assigned to your case</span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/apply/work-visa">
                <Button variant="heroGold" size="xl">
                  Apply Now — It's Free <ArrowRight className="ml-1 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/jobs">
                <Button variant="heroOutline" size="xl">
                  Browse Jobs First
                </Button>
              </Link>
            </div>
            <p className="mt-4 text-xs text-primary-foreground/40">
              No credit card required. No commitment until you approve the plan.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
