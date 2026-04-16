import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { CheckCircle2, XCircle, Shield, ArrowRight, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const plans = [
  {
    name: "Work Visa Application",
    price: "$1,000",
    currency: "USD",
    tagline: "Full support for your employer-sponsored work visa",
    href: "/apply/work-visa",
    featured: true,
    included: [
      "Profile review & eligibility assessment",
      "Personalised document checklist",
      "Complete application preparation & filing",
      "Step-by-step processing support",
      "Dedicated case officer & status updates",
      "Follow-up support until decision",
    ],
    notIncluded: [
      "Government / embassy fees",
      "Language test fees (IELTS / TOEFL)",
      "Credential evaluation (WES / ECA)",
      "Medical exam fees",
      "Translation & notarisation",
    ],
  },
  {
    name: "Study Visa Application",
    price: "$750",
    currency: "USD",
    tagline: "Find the right program and apply with confidence",
    href: "/apply/study",
    featured: false,
    included: [
      "Program matching & university shortlist",
      "Application & SOP preparation guidance",
      "Visa application support",
      "Document checklist & review",
      "Pre-departure orientation",
      "Follow-up until visa decision",
    ],
    notIncluded: [
      "Tuition fees & university deposits",
      "Language test fees (IELTS / TOEFL)",
      "Embassy / consulate fees",
      "Medical exam fees",
      "Translation & notarisation",
    ],
  },
];

export function PricingSection() {
  return (
    <section className="section-padding bg-surface">
      <div className="container-narrow">
        <div className="mx-auto max-w-2xl text-center">
          <div className="gold-divider mx-auto mb-5" />
          <h2 className="text-2xl font-bold md:text-3xl">Transparent, Honest Pricing</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            One clear service fee. Everything we do is included.
            Government and third-party fees are always shown separately — no hidden surprises.
          </p>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl gap-6 md:grid-cols-2">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card className={`h-full ${plan.featured ? "border-2 border-gold/40 shadow-lg" : ""}`}>
                <CardContent className="p-6 md:p-7">
                  {plan.featured && (
                    <div className="mb-3 inline-flex items-center gap-1 rounded-full bg-gold/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-gold">
                      <Shield className="h-3 w-3" /> Most Popular
                    </div>
                  )}

                  <h3 className="text-lg font-bold">{plan.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{plan.tagline}</p>

                  <div className="mt-4 flex items-end gap-1">
                    <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                    <span className="mb-1 text-xs text-muted-foreground">{plan.currency} • one-time service fee</span>
                  </div>

                  {/* What's included */}
                  <div className="mt-5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-green-700">What's Included</p>
                    <ul className="mt-2 space-y-1.5">
                      {plan.included.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm text-foreground/80">
                          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* What's NOT included */}
                  <div className="mt-5 rounded-lg border border-amber-200/60 bg-amber-50/40 p-4">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Not Included (Paid Separately)</p>
                    <ul className="mt-2 space-y-1">
                      {plan.notIncluded.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-xs text-amber-900/80">
                          <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-amber-700/60" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link to={plan.href} className="mt-5 block">
                    <Button variant={plan.featured ? "gold" : "outline"} size="lg" className="w-full gap-1">
                      Start Your Application <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <div className="mx-auto mt-8 flex max-w-3xl items-start gap-3 rounded-lg border border-border bg-card p-4">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p className="text-xs leading-relaxed text-muted-foreground">
            <strong className="text-foreground">Government and embassy fees</strong> are paid directly to the relevant authority — not to us.
            You'll receive a complete fee breakdown after your eligibility check, so you know the full cost before you commit.
          </p>
        </div>
      </div>
    </section>
  );
}
