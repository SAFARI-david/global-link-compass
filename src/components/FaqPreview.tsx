import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Plus, Minus, HelpCircle, ArrowRight, ShieldCheck, Clock, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";

type FaqItem = {
  q: string;
  a: string;
  category: "Eligibility" | "Timeline" | "Payment";
  icon: typeof ShieldCheck;
};

const faqs: FaqItem[] = [
  {
    category: "Eligibility",
    icon: ShieldCheck,
    q: "Am I eligible to apply for a work or study visa?",
    a: "Eligibility depends on the program — most require a valid passport, proof of qualifications, and either a job offer, study admission, or sufficient funds. Use our free eligibility check to get a quick assessment in under a minute.",
  },
  {
    category: "Eligibility",
    icon: ShieldCheck,
    q: "Do I need a job offer to apply for a work visa?",
    a: "It depends on the country. LMIA (Canada) and most employer-sponsored visas require a confirmed job offer, while pathways like Express Entry or Germany's Job Seeker Visa allow you to apply without one.",
  },
  {
    category: "Timeline",
    icon: Clock,
    q: "How long does the visa application process take?",
    a: "Initial response within 24 hours. Document preparation typically takes 1–3 weeks, and government processing ranges from 4–16 weeks depending on country and visa type. We give you a clear timeline upfront.",
  },
  {
    category: "Payment",
    icon: CreditCard,
    q: "What's included in your service fee?",
    a: "Our transparent fee covers eligibility assessment, document preparation, application submission, and ongoing case support. Government and embassy fees are included — no hidden surprises. You only pay once you approve the plan.",
  },
];

export function FaqPreview() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section-padding bg-surface">
      <div className="container-narrow">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* LEFT — intro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-4"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <HelpCircle className="h-3.5 w-3.5 text-accent" />
              Common Questions
            </div>

            <h2 className="mt-5 text-3xl font-extrabold leading-tight tracking-tight text-foreground md:text-4xl">
              Answers to the questions{" "}
              <span className="text-gradient-gold">applicants ask most</span>
            </h2>

            <p className="mt-4 text-base leading-relaxed text-muted-foreground">
              Quick, honest guidance on eligibility, timelines, and pricing — so you can
              start your application with confidence.
            </p>

            <div className="mt-6 hidden lg:block">
              <Link to="/faq">
                <Button variant="default" size="lg">
                  Browse all FAQs <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <p className="mt-3 text-xs text-muted-foreground">
                Still unsure?{" "}
                <Link to="/contact" className="font-semibold text-foreground underline-offset-4 hover:underline">
                  Talk to a specialist →
                </Link>
              </p>
            </div>
          </motion.div>

          {/* RIGHT — accordion */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:col-span-8"
          >
            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              {faqs.map((faq, i) => {
                const isOpen = openIndex === i;
                const Icon = faq.icon;
                return (
                  <div
                    key={faq.q}
                    className={i !== faqs.length - 1 ? "border-b border-border" : ""}
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : i)}
                      className="flex w-full items-start gap-4 px-5 py-5 text-left transition-colors hover:bg-muted/40 md:px-6 md:py-6"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="mb-1 text-[10px] font-bold uppercase tracking-widest text-accent">
                          {faq.category}
                        </div>
                        <div className="text-base font-bold text-foreground md:text-[17px]">
                          {faq.q}
                        </div>
                        {isOpen && (
                          <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.25 }}
                            className="mt-3 text-sm leading-relaxed text-muted-foreground"
                          >
                            {faq.a}
                          </motion.p>
                        )}
                      </div>
                      <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-background text-muted-foreground">
                        {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Mobile CTA */}
            <div className="mt-6 lg:hidden">
              <Link to="/faq">
                <Button variant="default" size="lg" className="w-full">
                  Browse all FAQs <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                Still unsure?{" "}
                <Link to="/contact" className="font-semibold text-foreground underline-offset-4 hover:underline">
                  Talk to a specialist →
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
