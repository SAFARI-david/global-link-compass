import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="section-padding">
      <div className="container-narrow">
        <motion.div
          className="rounded-2xl bg-navy-gradient p-10 text-center md:p-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-2xl font-extrabold text-primary-foreground md:text-4xl">
            Start Your Application Today
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-primary-foreground/60">
            Whether you're applying for a work visa, study visa, or looking for international job opportunities — we're here to guide you every step of the way.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link to="/apply/work-visa">
              <Button variant="heroGold" size="xl">
                Apply Now <ArrowRight className="ml-1 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/consultation">
              <Button variant="heroOutline" size="xl" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/5">
                Book Consultation
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
