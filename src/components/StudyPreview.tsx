import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { GraduationCap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function StudyPreview() {
  return (
    <section className="section-padding bg-surface">
      <div className="container-narrow">
        <motion.div
          className="relative overflow-hidden rounded-2xl bg-navy-gradient p-8 md:p-14"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold/10 blur-[60px]" />
          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-gold/10">
              <GraduationCap className="h-7 w-7 text-gold" />
            </div>
            <h2 className="text-2xl font-bold text-primary-foreground md:text-3xl">
              Find the Right Country & Course for Your Profile
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-primary-foreground/60">
              Answer a few questions about your education, budget, and goals — and we'll match you with the best study destinations, institutions, and programs.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/study">
                <Button variant="heroGold" size="lg">
                  Start Study Application <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/study-visas">
                <Button variant="heroOutline" size="lg" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/5">
                  Browse Programs
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
