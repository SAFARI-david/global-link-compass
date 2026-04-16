import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Briefcase, GraduationCap, Plane, Users, CheckCircle2, Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const entryCards = [
  { icon: Briefcase, title: "Work Visas", desc: "Answer 3 questions — get matched with the right program", to: "/guide/work", color: "text-primary" },
  { icon: GraduationCap, title: "Study Visas", desc: "Find the perfect study program for your goals & budget", to: "/guide/study", color: "text-accent" },
  { icon: Plane, title: "Find Jobs", desc: "Browse visa-sponsored jobs by country & category", to: "/jobs", color: "text-primary" },
  { icon: Users, title: "For Agents", desc: "Submit & manage client applications at scale", to: "/agents", color: "text-accent" },
];

const trustPoints = [
  "We respond within 24 hours",
  "Structured application process",
  "Professional support at every step",
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-navy-gradient">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-gold blur-[100px]" />
        <div className="absolute -left-20 bottom-0 h-60 w-60 rounded-full bg-primary-foreground blur-[80px]" />
      </div>

      <div className="container-narrow relative z-10 pb-16 pt-16 md:pb-24 md:pt-20">
        {/* Main hero content */}
        <div className="mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/10 bg-primary-foreground/5 px-4 py-1.5 text-xs font-medium text-primary-foreground/80">
              <Shield className="h-3.5 w-3.5" />
              Trusted Immigration & Opportunities Platform
            </div>
          </motion.div>

          <motion.h1
            className="text-3xl font-extrabold leading-tight tracking-tight text-primary-foreground md:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Trusted Support for{" "}
            <span className="text-gradient-gold">Work Visas</span>,{" "}
            <span className="text-gradient-gold">Study Visas</span> & International Applications
          </motion.h1>

          <motion.p
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-primary-foreground/70 md:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            We help applicants and agents manage work visa, study visa, and international opportunity applications through a structured, professional, and transparent process.
          </motion.p>

          <motion.div
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Link to="/apply/work-visa">
              <Button variant="heroGold" size="xl">
                Start Your Application <ArrowRight className="ml-1 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/advisor">
              <Button variant="heroOutline" size="xl">
                🤖 Find My Program
              </Button>
            </Link>
            <Link to="/jobs">
              <Button variant="ghost" size="lg" className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/5">
                Explore Jobs
              </Button>
            </Link>
          </motion.div>

          {/* Trust points */}
          <motion.div
            className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {trustPoints.map((point) => (
              <span key={point} className="flex items-center gap-1.5 text-xs text-primary-foreground/50">
                <CheckCircle2 className="h-3.5 w-3.5 text-gold" />
                {point}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Entry cards */}
        <div className="mx-auto mt-14 grid max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {entryCards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
            >
              <Link to={card.to} className="group block rounded-xl border border-primary-foreground/8 bg-primary-foreground/5 p-5 backdrop-blur-sm transition-all duration-300 hover:border-gold/30 hover:bg-primary-foreground/10">
                <card.icon className={`h-8 w-8 text-gold`} />
                <h3 className="mt-3 text-sm font-bold text-primary-foreground">{card.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-primary-foreground/50">{card.desc}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-gold opacity-0 transition-opacity group-hover:opacity-100">
                  Get started <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
