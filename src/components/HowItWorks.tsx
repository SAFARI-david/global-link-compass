import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { FileText, UserCheck, ClipboardList, ArrowRight as ArrowRightIcon, Send, CreditCard, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  { 
    icon: FileText, 
    title: "Tell Us About Yourself", 
    desc: "Fill out a simple form — it takes about 15 minutes, and we only ask what matters",
    detail: "No jargon, no confusion. We'll guide you.",
  },
  { 
    icon: UserCheck, 
    title: "We Review Your Profile", 
    desc: "A real person checks your details and confirms you're eligible",
    detail: "You'll hear from us within 24 hours.",
  },
  { 
    icon: ClipboardList, 
    title: "Your Personal Checklist", 
    desc: "We send you exactly which documents you need — no guessing",
    detail: "Clear, specific, and tailored to your situation.",
  },
  { 
    icon: CreditCard, 
    title: "Transparent Pricing", 
    desc: "See a full breakdown before you pay anything",
    detail: "No surprises. No hidden fees. Promise.",
  },
  { 
    icon: Send, 
    title: "We Submit for You", 
    desc: "Your polished application goes in — professionally prepared",
    detail: "Track everything from your dashboard.",
  },
];

export function HowItWorks() {
  return (
    <section className="section-padding">
      <div className="container-narrow">
        <div className="mx-auto max-w-2xl text-center">
          <div className="gold-divider mx-auto mb-5" />
          <h2 className="text-2xl font-bold md:text-3xl">Here's How It Works</h2>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            Five simple steps from "I'm interested" to "My application is in." <strong className="text-foreground">We'll be with you the whole way.</strong>
          </p>
        </div>

        <div className="mt-14 flex flex-col items-center gap-0 md:flex-row md:items-start md:justify-between">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              className="relative flex flex-col items-center text-center md:flex-1"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              {i < steps.length - 1 && (
                <div className="absolute left-[calc(50%+28px)] top-7 hidden h-[2px] w-[calc(100%-56px)] bg-border md:block" />
              )}
              
              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
                <step.icon className="h-6 w-6" />
              </div>
              <span className="mt-1 text-xs font-bold text-gold">Step {i + 1}</span>
              <h3 className="mt-2 text-sm font-bold">{step.title}</h3>
              <p className="mt-1 max-w-[160px] text-xs leading-relaxed text-muted-foreground">{step.desc}</p>
              <p className="mt-1 max-w-[160px] text-[10px] font-medium text-gold/80">{step.detail}</p>

              {i < steps.length - 1 && (
                <div className="my-3 h-6 w-[2px] bg-border md:hidden" />
              )}
            </motion.div>
          ))}
        </div>

        {/* What happens after? */}
        <motion.div
          className="mx-auto mt-12 max-w-2xl rounded-xl border border-border bg-card p-6 text-center shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <h3 className="text-base font-bold">What Happens After Submission?</h3>
          <div className="mt-4 grid gap-3 text-left text-sm">
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/10 text-xs font-bold text-gold">1</span>
              <span className="text-muted-foreground">You receive a <strong className="text-foreground">confirmation email</strong> with your application reference number</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/10 text-xs font-bold text-gold">2</span>
              <span className="text-muted-foreground">A specialist reviews your profile and contacts you within <strong className="text-foreground">24 hours</strong></span>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold/10 text-xs font-bold text-gold">3</span>
              <span className="text-muted-foreground">You'll receive a <strong className="text-foreground">clear fee breakdown</strong> — no payment until you approve</span>
            </div>
          </div>
          <div className="mt-5">
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
