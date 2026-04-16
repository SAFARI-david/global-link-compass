import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { GraduationCap, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const outcomes = [
  "Personalized country & program recommendations",
  "Full admission and visa application support",
  "Scholarship opportunities identified for your profile",
  "Post-study work permit guidance included",
];

export function StudyPreview() {
  return (
    <section className="section-padding bg-surface">
      <div className="container-narrow">
        <motion.div
          className="relative overflow-hidden rounded-2xl bg-navy-gradient"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/10 blur-[60px]" />
          <div className="relative z-10 grid items-center gap-8 p-8 md:grid-cols-2 md:p-14">
            {/* Left: content */}
            <div>
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gold/10">
                <GraduationCap className="h-7 w-7 text-gold" />
              </div>
              <h2 className="text-2xl font-bold text-primary-foreground md:text-3xl">
                Find the Right Country & Course for Your Profile
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-primary-foreground/60">
                Answer a few questions about your education, budget, and goals — and we'll match you with the best study destinations, institutions, and programs.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link to="/apply/study">
                  <Button variant="heroGold" size="lg">
                    Start Study Application <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/study">
                  <Button variant="heroOutline" size="lg" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/5">
                    Browse Programs
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right: what you get */}
            <div className="rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-6">
              <p className="text-xs font-semibold uppercase tracking-wider text-gold">What you'll receive</p>
              <ul className="mt-4 space-y-3">
                {outcomes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-primary-foreground/70">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-5 border-t border-primary-foreground/10 pt-4">
                <p className="text-xs text-primary-foreground/40">
                  Service fees apply. No payment until you approve your study plan. Government and tuition fees are separate.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
