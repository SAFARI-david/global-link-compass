import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Eye, HeadphonesIcon, LayoutList, ArrowUpRight, Shield, Clock, Users, CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const trustItems = [
  { icon: Eye, title: "Transparent Process", desc: "Track your application status at every stage. No hidden steps, no surprises. You always know exactly where you stand." },
  { icon: HeadphonesIcon, title: "Professional Support", desc: "Dedicated support via email, live chat, and in-dashboard messaging. Real people, not bots." },
  { icon: LayoutList, title: "Structured Applications", desc: "Guided forms ensure nothing is missed. Every required document and detail is clearly listed before you start." },
  { icon: ArrowUpRight, title: "Clear Next Steps", desc: "After every action you take, we tell you exactly what happens next and when to expect a response." },
];

const stats = [
  { value: "2,400+", label: "Applications Processed" },
  { value: "24hr", label: "Average Response Time" },
  { value: "98%", label: "Client Satisfaction" },
  { value: "35+", label: "Destination Countries" },
];

export function TrustBlock() {
  return (
    <section className="section-padding bg-surface">
      <div className="container-narrow">
        <div className="mx-auto max-w-2xl text-center">
          <div className="gold-divider mx-auto mb-5" />
          <h2 className="text-2xl font-bold md:text-3xl">Why Applicants Trust Us</h2>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            We built this platform around one principle: <strong className="text-foreground">you should never feel confused</strong>. 
            Every step is designed so you know what's happening, what's needed, and what comes next.
          </p>
        </div>

        {/* Stats bar */}
        <motion.div
          className="mt-10 grid grid-cols-2 gap-4 rounded-xl border border-border bg-card p-6 shadow-sm md:grid-cols-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-extrabold text-primary md:text-3xl">{s.value}</p>
              <p className="mt-1 text-xs font-medium text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Trust cards */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {trustItems.map((item, i) => (
            <motion.div
              key={item.title}
              className="flex flex-col items-center text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gold/10">
                <item.icon className="h-7 w-7 text-gold" />
              </div>
              <h3 className="mt-4 text-sm font-bold">{item.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Reassurance banner */}
        <motion.div
          className="mt-10 rounded-xl border border-gold/20 bg-gold/5 p-5 md:p-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <div className="flex flex-col items-center gap-4 text-center md:flex-row md:text-left">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold/10">
              <Shield className="h-6 w-6 text-gold" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold">No Payment Until You're Ready</h4>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                Submitting your application is <strong className="text-foreground">free</strong>. 
                We only discuss fees after reviewing your profile and confirming your eligibility. 
                You'll receive a clear breakdown before any payment is required.
              </p>
            </div>
            <Link to="/apply/work-visa">
              <Button variant="gold" size="default">
                Start Your Application <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
