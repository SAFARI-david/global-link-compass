import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    text: "Global Link made my Canada work visa process incredibly smooth. The structured application form and clear communication were exactly what I needed.",
    name: "Ahmed K.",
    country: "Nigeria → Canada",
    type: "Work Visa",
  },
  {
    text: "As an agent, the portal saves me hours every week. I can submit multiple applications and track all my clients in one place.",
    name: "Priya M.",
    country: "India",
    type: "Agent Partner",
  },
  {
    text: "I was matched with the perfect university program within days. The study application process was guided and easy to follow.",
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
      </div>
    </section>
  );
}
