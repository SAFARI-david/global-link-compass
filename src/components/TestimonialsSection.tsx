import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Star, Quote, ArrowRight, Shield, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import ahmedAvatar from "@/assets/avatars/ahmed.jpg";
import priyaAvatar from "@/assets/avatars/priya.jpg";
import sarahAvatar from "@/assets/avatars/sarah.jpg";
import davidAvatar from "@/assets/avatars/david.jpg";
import fatimaAvatar from "@/assets/avatars/fatima.jpg";
import jamesAvatar from "@/assets/avatars/james.jpg";

const testimonials = [
  {
    text: "Global Link made my Canada work visa process incredibly smooth. The structured application form and clear communication were exactly what I needed. I always knew what was happening with my case.",
    name: "Ahmed K.",
    country: "Nigeria → Canada",
    type: "Work Visa",
    rating: 5,
    photo: ahmedAvatar,
  },
  {
    text: "As an agent, the portal saves me hours every week. I can manage multiple client applications and track statuses in one place. The dashboard is professional and the commission tracking is transparent.",
    name: "Priya M.",
    country: "India",
    type: "Agent Partner",
    rating: 5,
    photo: priyaAvatar,
  },
  {
    text: "I was matched with the perfect university program within days. The study application process was guided and easy to follow. I never felt lost or confused at any step of the journey.",
    name: "Sarah L.",
    country: "Philippines → UK",
    type: "Study Visa",
    rating: 5,
    photo: sarahAvatar,
  },
  {
    text: "The transparent pricing was what convinced me. I knew exactly what the service fee covered and what government fees were separate. No surprises — just professional, honest service from start to finish.",
    name: "David O.",
    country: "Ghana → Australia",
    type: "Work Visa",
    rating: 5,
    photo: davidAvatar,
  },
  {
    text: "I applied for a visa-sponsored job through Global Link and received interview coaching that made all the difference. Within 3 months I had an offer and my visa was in process. Highly recommend.",
    name: "Fatima R.",
    country: "Pakistan → UAE",
    type: "Job Placement",
    rating: 5,
    photo: fatimaAvatar,
  },
  {
    text: "The step-by-step process removed all the anxiety. Every document was clearly listed, every deadline was tracked, and I could see my application status in real time. Truly professional service.",
    name: "James T.",
    country: "Kenya → Germany",
    type: "Work Visa",
    rating: 5,
    photo: jamesAvatar,
  },
];

export function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  // Show 3 on desktop, 1 on mobile — carousel auto-advances
  const visibleCount = 3;

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  }, []);

  // Auto-advance every 5 seconds
  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  // Get visible testimonials (wrapping around)
  const getVisible = () => {
    const items = [];
    for (let i = 0; i < visibleCount; i++) {
      items.push(testimonials[(current + i) % testimonials.length]);
    }
    return items;
  };

  const visible = getVisible();

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

        {/* Carousel */}
        <div className="relative mt-12">
          {/* Navigation arrows */}
          <button
            onClick={prev}
            className="absolute -left-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border bg-card shadow-md transition-colors hover:bg-muted md:-left-5"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={next}
            className="absolute -right-3 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border bg-card shadow-md transition-colors hover:bg-muted md:-right-5"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Cards */}
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={current}
              className="grid gap-6 md:grid-cols-3"
              initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -60 : 60 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              {visible.map((t, i) => (
                <div
                  key={t.name}
                  className={`card-premium flex flex-col p-6 ${i > 0 ? "hidden md:flex" : ""}`}
                >
                  <Quote className="h-6 w-6 text-gold/30" />
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                    "{t.text}"
                  </p>

                  {/* Star rating */}
                  <div className="mt-4 flex items-center gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <Star
                        key={j}
                        className={`h-3.5 w-3.5 ${j < t.rating ? "fill-gold text-gold" : "fill-muted text-muted"}`}
                      />
                    ))}
                  </div>

                  {/* Author */}
                    <div className="mt-3 flex items-center gap-3 border-t border-border pt-3">
                      <img src={t.photo} alt={t.name} loading="lazy" width={36} height={36} className="h-9 w-9 shrink-0 rounded-full object-cover" />
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.country} · {t.type}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Dots indicator */}
          <div className="mt-6 flex items-center justify-center gap-1.5">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? "w-6 bg-gold" : "w-1.5 bg-border hover:bg-muted-foreground/30"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
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
            <p className="mt-1 text-xs text-muted-foreground">
              Start your application today. No payment required until we confirm your eligibility and you approve the plan.
            </p>
          </div>
          <Link to="/apply/work-visa">
            <Button variant="gold" size="default">
              Start Your Application <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
