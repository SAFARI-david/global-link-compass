import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Briefcase, GraduationCap, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const pathways = [
  {
    icon: Briefcase,
    title: "Work Visa",
    desc: "Get matched with work visa programs in Canada, UK, UAE & more",
    cta: "Check Eligibility",
    to: "/guide/work",
  },
  {
    icon: GraduationCap,
    title: "Study Visa",
    desc: "Find study programs that fit your budget and career goals",
    cta: "Explore Programs",
    to: "/guide/study",
  },
  {
    icon: MapPin,
    title: "Find Jobs",
    desc: "Browse visa-sponsored positions by country and industry",
    cta: "Browse Jobs",
    to: "/jobs",
  },
];

interface Props {
  onCtaClick?: (action: string) => void;
}

export function HeroVariantC({ onCtaClick }: Props) {
  return (
    <section className="relative overflow-hidden bg-navy-gradient">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gold/15 blur-[180px]" />
      </div>

      <div className="container-narrow relative z-10 pb-20 pt-16 md:pb-28 md:pt-24">
        {/* Centered headline — short & punchy */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.h1
            className="text-4xl font-extrabold leading-[1.08] tracking-tight text-primary-foreground md:text-6xl lg:text-7xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Your Path to{" "}
            <span className="text-gradient-gold">Working & Studying Abroad</span>
          </motion.h1>

          <motion.p
            className="mx-auto mt-5 max-w-lg text-base text-primary-foreground/65 md:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Choose your pathway below. We'll guide you through every step — from eligibility check to final approval.
          </motion.p>

          <motion.div
            className="mt-6 flex flex-wrap items-center justify-center gap-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {["Clear process", "No hidden fees", "Support at every step"].map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-xs font-medium text-primary-foreground/50">
                <CheckCircle2 className="h-3.5 w-3.5 text-gold" />
                {t}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Three pathway cards — large and prominent */}
        <div className="mx-auto mt-14 grid max-w-4xl gap-5 md:grid-cols-3">
          {pathways.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.12 }}
            >
              <Link
                to={p.to}
                onClick={() => onCtaClick?.(`pathway_${p.title.toLowerCase().replace(/\s/g, "_")}`)}
                className="group flex h-full flex-col rounded-2xl border border-primary-foreground/8 bg-primary-foreground/5 p-7 backdrop-blur-sm transition-all duration-300 hover:border-gold/30 hover:bg-primary-foreground/10 hover:shadow-lg hover:shadow-gold/5"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/10">
                  <p.icon className="h-6 w-6 text-gold" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-primary-foreground">{p.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-primary-foreground/50">{p.desc}</p>
                <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-gold transition-transform group-hover:translate-x-1">
                  {p.cta} <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <p className="mb-4 text-sm text-primary-foreground/50">Not sure which path is right for you?</p>
          <Link to="/advisor" onClick={() => onCtaClick?.("ai_advisor")}>
            <Button variant="heroOutline" size="lg">
              🤖 Get a Personalized Recommendation
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
