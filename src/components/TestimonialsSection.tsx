import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Star, Quote, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials = [
  {
    text: "Global Link made my Canada work visa process incredibly smooth. The structured application form and clear communication were exactly what I needed. I always knew what was happening.",
    name: "Ahmed K.",
    country: "Nigeria → Canada",
    type: "Work Visa",
  },
  {
    text: "As an agent, the portal saves me hours every week. I can submit multiple applications and track all my clients in one place. The dashboard is professional and easy to use.",
    name: "Priya M.",
    country: "India",
    type: "Agent Partner",
  },
  {
    text: "I was matched with the perfect university program within days. The study application process was guided and easy to follow. I never felt lost or confused at any step.",
    name: "Sarah L.",
    country: "Philippines → UK",
    type: "Study Visa",
  },
];

export function TestimonialsSection() {
  return (
    <section className="section-padding bg-surface">
      <div className="container-narrow">
        <div className="mx-auto max-w-2xl text-center">
          <div className="gold-divider mx-auto mb-5" />
          <h2 className="text-2xl font-bold md:text-3xl">What Our Clients Say</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Real feedback from applicants and agents who used our platform.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="card-premium flex flex-col p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Quote className="h-6 w-6 text-gold/30" />
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">"{t.text}"</p>
              <div className="mt-4 flex items-center gap-1">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-gold text-gold" />
                ))}
              </div>
              <div className="mt-3 border-t border-border pt-3">
                <p className="text-sm font-semibold">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.country} · {t.type}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Post-testimonials CTA */}
        <motion.div
          className="mt-10 flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-6 text-center shadow-sm sm:flex-row sm:text-left"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold/10">
            <Shield className="h-6 w-6 text-gold" />
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-bold">Join thousands of successful applicants</h4>
            <p className="mt-1 text-xs text-muted-foreground">Start your free application today. No payment required until we confirm your eligibility.</p>
          </div>
          <Link to="/apply/work-visa">
            <Button variant="gold" size="default">
              Start Application <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
