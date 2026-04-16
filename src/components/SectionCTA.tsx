import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EligibilityCheck } from "./EligibilityCheck";

interface Props {
  /** Headline text */
  title?: string;
  /** Sub-text under headline */
  subtitle?: string;
  /** Primary CTA destination */
  primaryHref?: string;
  /** Primary CTA label */
  primaryLabel?: string;
  /** Show the secondary "Check Your Eligibility" button */
  showEligibility?: boolean;
  /** Visual variant */
  variant?: "default" | "compact" | "navy";
}

export function SectionCTA({
  title = "Ready to begin?",
  subtitle = "Start your application today — get a response within 24 hours.",
  primaryHref = "/apply/work-visa",
  primaryLabel = "Start Your Application",
  showEligibility = true,
  variant = "default",
}: Props) {
  const [eligibilityOpen, setEligibilityOpen] = useState(false);

  if (variant === "compact") {
    return (
      <>
        <div className="container-narrow py-8">
          <motion.div
            className="flex flex-col items-center justify-between gap-4 rounded-xl border border-gold/20 bg-gradient-to-br from-card to-muted/30 p-5 sm:flex-row sm:p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <div className="text-center sm:text-left">
              <p className="text-sm font-bold">{title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
            </div>
            <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
              {showEligibility && (
                <Button variant="outline" size="default" onClick={() => setEligibilityOpen(true)} className="gap-1">
                  Check Your Eligibility
                </Button>
              )}
              <Link to={primaryHref}>
                <Button variant="gold" size="default" className="w-full gap-1 sm:w-auto">
                  {primaryLabel} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
        <EligibilityCheck open={eligibilityOpen} onOpenChange={setEligibilityOpen} />
      </>
    );
  }

  if (variant === "navy") {
    return (
      <>
        <section className="bg-navy-gradient py-12 md:py-16">
          <div className="container-narrow">
            <motion.div
              className="mx-auto max-w-2xl text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
            >
              <Sparkles className="mx-auto h-6 w-6 text-gold" />
              <h3 className="mt-3 text-xl font-bold text-primary-foreground md:text-2xl">{title}</h3>
              <p className="mt-2 text-sm text-primary-foreground/70">{subtitle}</p>
              <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link to={primaryHref}>
                  <Button variant="heroGold" size="lg" className="gap-1">
                    {primaryLabel} <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                {showEligibility && (
                  <Button variant="heroOutline" size="lg" onClick={() => setEligibilityOpen(true)}>
                    Check Your Eligibility
                  </Button>
                )}
              </div>
            </motion.div>
          </div>
        </section>
        <EligibilityCheck open={eligibilityOpen} onOpenChange={setEligibilityOpen} />
      </>
    );
  }

  // default
  return (
    <>
      <section className="section-padding">
        <div className="container-narrow">
          <motion.div
            className="mx-auto flex max-w-3xl flex-col items-center gap-4 rounded-2xl border border-gold/20 bg-card p-6 text-center shadow-sm md:p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            <Sparkles className="h-6 w-6 text-gold" />
            <h3 className="text-xl font-bold md:text-2xl">{title}</h3>
            <p className="max-w-md text-sm text-muted-foreground">{subtitle}</p>
            <div className="mt-2 flex flex-col items-center gap-2 sm:flex-row">
              <Link to={primaryHref}>
                <Button variant="gold" size="lg" className="gap-1">
                  {primaryLabel} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              {showEligibility && (
                <Button variant="outline" size="lg" onClick={() => setEligibilityOpen(true)}>
                  Check Your Eligibility
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </section>
      <EligibilityCheck open={eligibilityOpen} onOpenChange={setEligibilityOpen} />
    </>
  );
}
