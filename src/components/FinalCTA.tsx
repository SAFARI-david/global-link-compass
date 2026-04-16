import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Shield, Clock, CheckCircle2, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";

const reassurances = [
  { icon: Shield, text: "Structured application process" },
  { icon: Clock, text: "Response within 24 hours" },
  { icon: CreditCard, text: "No payment until you approve" },
  { icon: CheckCircle2, text: "Clear pricing — no hidden fees" },
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
          <div className="p-8 md:p-14">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-2xl font-extrabold text-primary-foreground md:text-4xl">
                Ready to Start Your Application?
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-primary-foreground/60">
                Tell us what you're looking for. We'll guide you to the right program, review your eligibility, and create a personalised plan.
              </p>
            </div>

            {/* Lead capture form */}
            <div className="mx-auto mt-8 max-w-2xl">
              <LeadCaptureForm variant="dark" source="homepage-cta" />
            </div>

            <p className="mt-4 text-center text-xs text-primary-foreground/40">
              Service fees apply. Government and third-party fees are separate.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
