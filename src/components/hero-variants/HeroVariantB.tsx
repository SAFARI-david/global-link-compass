import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Globe, TrendingUp, Users, FileCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EligibilityCheck } from "@/components/EligibilityCheck";

const stats = [
  { value: "15+", label: "Countries Covered" },
  { value: "24h", label: "Response Time" },
  { value: "5-Step", label: "Clear Process" },
];

const benefits = [
  { icon: Globe, title: "Global Coverage", desc: "Work & study visa programs across 15+ countries" },
  { icon: FileCheck, title: "Document Support", desc: "Step-by-step guidance on every required document" },
  { icon: TrendingUp, title: "Track Progress", desc: "Real-time updates on your application status" },
  { icon: Users, title: "Dedicated Support", desc: "Professional team available throughout the process" },
];

interface Props {
  onCtaClick?: (action: string) => void;
}

export function HeroVariantB({ onCtaClick }: Props) {
  return (
    <section className="relative overflow-hidden bg-navy-gradient">
      <div className="absolute inset-0 opacity-8">
        <div className="absolute right-0 top-0 h-[600px] w-[600px] rounded-full bg-gold/20 blur-[150px]" />
        <div className="absolute -left-32 bottom-0 h-[400px] w-[400px] rounded-full bg-accent/10 blur-[120px]" />
      </div>

      <div className="container-narrow relative z-10 pb-20 pt-16 md:pb-28 md:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — headline + CTA */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-gold/10 px-4 py-1.5 text-xs font-semibold text-gold">
              <Globe className="h-3.5 w-3.5" />
              Your Immigration Journey Starts Here
            </div>

            <h1 className="text-3xl font-extrabold leading-[1.1] tracking-tight text-primary-foreground md:text-5xl lg:text-[3.5rem]">
              Build Your Future{" "}
              <span className="block text-gradient-gold">Work & Study Abroad</span>
            </h1>

            <p className="mt-5 max-w-lg text-base leading-relaxed text-primary-foreground/65 md:text-lg">
              Professional visa application support with a clear, structured process.
              From initial consultation to final approval — we guide you at every step.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/apply/work-visa" onClick={() => onCtaClick?.("start_application")}>
                <Button variant="heroGold" size="xl" className="w-full sm:w-auto">
                  Start Your Application <ArrowRight className="ml-1 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/services" onClick={() => onCtaClick?.("explore_services")}>
                <Button variant="heroOutline" size="xl" className="w-full sm:w-auto">
                  Explore Services
                </Button>
              </Link>
            </div>

            {/* Stats row */}
            <div className="mt-10 flex gap-8">
              {stats.map((s) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  <div className="text-2xl font-extrabold text-gold md:text-3xl">{s.value}</div>
                  <div className="mt-1 text-xs text-primary-foreground/50">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right — benefit cards */}
          <motion.div
            className="grid gap-3 sm:grid-cols-2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                className="group rounded-xl border border-primary-foreground/8 bg-primary-foreground/5 p-5 backdrop-blur-sm transition-all duration-300 hover:border-gold/25 hover:bg-primary-foreground/8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              >
                <b.icon className="h-7 w-7 text-gold" />
                <h3 className="mt-3 text-sm font-bold text-primary-foreground">{b.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-primary-foreground/50">{b.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Trust bar */}
        <motion.div
          className="mt-14 flex flex-wrap items-center justify-center gap-6 rounded-xl border border-primary-foreground/5 bg-primary-foreground/3 px-6 py-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {["Professional guidance at every step", "Transparent pricing — no hidden fees", "Structured 5-step process"].map((t) => (
            <span key={t} className="flex items-center gap-2 text-xs font-medium text-primary-foreground/60">
              <CheckCircle2 className="h-4 w-4 text-gold" />
              {t}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
