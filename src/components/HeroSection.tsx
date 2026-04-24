import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Briefcase,
  GraduationCap,
  Plane,
  Globe2,
  ShieldCheck,
  Star,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { EligibilityCheck } from "@/components/EligibilityCheck";
import { useABTest } from "@/hooks/use-ab-test";

const pathways = [
  {
    id: "work",
    icon: Briefcase,
    label: "Work Visa",
    blurb: "Sponsored roles & skilled migration",
    to: "/apply/work-visa",
  },
  {
    id: "study",
    icon: GraduationCap,
    label: "Study Visa",
    blurb: "Universities & scholarships abroad",
    to: "/apply/study",
  },
  {
    id: "visit",
    icon: Plane,
    label: "Visit Visa",
    blurb: "Tourism, family & business travel",
    to: "/apply/visit-visa",
  },
];

const metrics = [
  { value: "12+", label: "Destination countries" },
  { value: "24h", label: "Initial response" },
  { value: "98%", label: "Document accuracy" },
  { value: "4.9★", label: "Client rating" },
];

const trustChips = [
  "Government & embassy fees included",
  "Licensed migration specialists",
  "No payment until you approve",
];

export function HeroSection() {
  const [eligibilityOpen, setEligibilityOpen] = useState(false);
  const [activePath, setActivePath] = useState<string>("work");

  const { trackImpression, trackConversion } = useABTest({
    testId: "homepage_hero_v2",
    variants: ["A"],
    weights: [100],
  });

  useEffect(() => {
    trackImpression();
  }, [trackImpression]);

  const active = pathways.find((p) => p.id === activePath) ?? pathways[0];

  return (
    <section className="relative overflow-hidden bg-navy-gradient">
      {/* Ambient glow */}
      <div className="pointer-events-none absolute inset-0 opacity-40">
        <div className="absolute -right-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-gold/20 blur-[120px]" />
        <div className="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-primary-foreground/10 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-gold/10 blur-[90px]" />
      </div>

      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(var(--gold) 1px, transparent 1px), linear-gradient(90deg, var(--gold) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
      />

      <div className="container-narrow relative z-10 pt-14 pb-16 md:pt-20 md:pb-24">
        <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* LEFT — Headline & Proof */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Trusted Migration Partner since 2018
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.05 }}
              className="text-4xl font-extrabold leading-[1.05] tracking-tight text-primary-foreground md:text-5xl lg:text-6xl"
            >
              Your passport to a{" "}
              <span className="text-gradient-gold">global future</span>
              <span className="text-primary-foreground">.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="mt-5 max-w-xl text-base leading-relaxed text-primary-foreground/70 md:text-lg"
            >
              End-to-end visa support for work, study and travel — handled by licensed
              specialists. Transparent pricing with government and embassy fees{" "}
              <span className="font-semibold text-primary-foreground">included</span>.
            </motion.p>

            {/* Trust chips */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-6 flex flex-wrap gap-x-5 gap-y-2"
            >
              {trustChips.map((chip) => (
                <span
                  key={chip}
                  className="flex items-center gap-1.5 text-xs font-medium text-primary-foreground/60"
                >
                  <CheckCircle2 className="h-3.5 w-3.5 text-gold" />
                  {chip}
                </span>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center"
            >
              <Link
                to={active.to as any}
                onClick={() => trackConversion(`primary_${active.id}`)}
              >
                <Button variant="heroGold" size="xl" className="w-full sm:w-auto">
                  Start Your Application Today <ArrowRight className="ml-1 h-5 w-5" />
                </Button>
              </Link>
              <Button
                variant="heroOutline"
                size="xl"
                onClick={() => {
                  trackConversion("check_eligibility");
                  setEligibilityOpen(true);
                }}
                className="w-full sm:w-auto"
              >
                Check your free eligibility
              </Button>
            </motion.div>

            {/* Strong trust line */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm font-medium text-primary-foreground/80"
            >
              <CheckCircle2 className="h-4 w-4 text-gold" />
              A licensed migration specialist will respond within 24 hours — no obligation, no spam.
            </motion.p>

            {/* Rating row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 flex items-center gap-4 border-t border-primary-foreground/10 pt-6"
            >
              <div className="flex -space-x-2">
                {[
                  "from-amber-400 to-orange-500",
                  "from-rose-400 to-pink-500",
                  "from-sky-400 to-indigo-500",
                  "from-emerald-400 to-teal-500",
                ].map((g, i) => (
                  <div
                    key={i}
                    className={`h-9 w-9 rounded-full border-2 border-navy-dark bg-gradient-to-br ${g}`}
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
                  ))}
                  <span className="ml-1.5 text-xs font-bold text-primary-foreground">
                    4.9 / 5
                  </span>
                </div>
                <p className="text-xs text-primary-foreground/60">
                  from 2,400+ verified applicants worldwide
                </p>
              </div>
            </motion.div>
          </div>

          {/* RIGHT — Pathway selector card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="lg:col-span-5"
          >
            <div className="relative rounded-2xl border border-primary-foreground/10 bg-primary-foreground/[0.04] p-6 backdrop-blur-xl shadow-2xl md:p-7">
              {/* Glow border accent */}
              <div className="pointer-events-none absolute -inset-px rounded-2xl bg-gradient-to-br from-gold/20 via-transparent to-transparent opacity-60" />

              <div className="relative">
                <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold">
                  <Globe2 className="h-3.5 w-3.5" />
                  Begin in 30 seconds
                </div>
                <h2 className="text-xl font-bold text-primary-foreground md:text-2xl">
                  What are you applying for?
                </h2>
                <p className="mt-1 text-sm text-primary-foreground/60">
                  Choose a pathway and we'll guide you to the right program.
                </p>

                <div className="mt-5 space-y-2.5">
                  {pathways.map((p) => {
                    const Icon = p.icon;
                    const isActive = activePath === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setActivePath(p.id)}
                        className={`group flex w-full items-center gap-4 rounded-xl border p-3.5 text-left transition-all ${
                          isActive
                            ? "border-gold/60 bg-gold/10"
                            : "border-primary-foreground/10 bg-primary-foreground/[0.03] hover:border-primary-foreground/20 hover:bg-primary-foreground/[0.06]"
                        }`}
                      >
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg transition-colors ${
                            isActive
                              ? "bg-gold text-gold-foreground"
                              : "bg-primary-foreground/10 text-gold"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-bold text-primary-foreground">
                            {p.label}
                          </div>
                          <div className="text-xs text-primary-foreground/55">
                            {p.blurb}
                          </div>
                        </div>
                        <ArrowRight
                          className={`h-4 w-4 transition-all ${
                            isActive
                              ? "translate-x-0 text-gold opacity-100"
                              : "-translate-x-1 text-primary-foreground/40 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>

                <Link
                  to={active.to as any}
                  onClick={() => trackConversion(`pathway_${active.id}`)}
                  className="mt-5 block"
                >
                  <Button variant="heroGold" size="lg" className="w-full">
                    Continue with {active.label} <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>

                <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-primary-foreground/50">
                  <ShieldCheck className="h-3.5 w-3.5 text-gold" />
                  Secure & confidential — your data stays private
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Metrics strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-primary-foreground/10 bg-primary-foreground/[0.06] md:grid-cols-4"
        >
          {metrics.map((m) => (
            <div
              key={m.label}
              className="bg-navy/30 px-5 py-5 text-center backdrop-blur-sm"
            >
              <div className="text-2xl font-extrabold text-gradient-gold md:text-3xl">
                {m.value}
              </div>
              <div className="mt-1 text-[11px] font-medium uppercase tracking-wider text-primary-foreground/55">
                {m.label}
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      <EligibilityCheck open={eligibilityOpen} onOpenChange={setEligibilityOpen} />
    </section>
  );
}
