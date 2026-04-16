import { motion } from "framer-motion";
import { FileText, UserCheck, ClipboardList, ArrowRight as ArrowRightIcon, Send } from "lucide-react";

const steps = [
  { icon: FileText, title: "Submit Details", desc: "Complete the structured application form with your information" },
  { icon: UserCheck, title: "Profile Review", desc: "Our team reviews your profile and eligibility" },
  { icon: ClipboardList, title: "Document Checklist", desc: "Receive your personalized document requirements" },
  { icon: ArrowRightIcon, title: "Guided Process", desc: "Step-by-step support through the entire process" },
  { icon: Send, title: "Application Submitted", desc: "Your complete application is submitted professionally" },
];

export function HowItWorks() {
  return (
    <section className="section-padding">
      <div className="container-narrow">
        <div className="mx-auto max-w-2xl text-center">
          <div className="gold-divider mx-auto mb-5" />
          <h2 className="text-2xl font-bold md:text-3xl">How It Works</h2>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            A clear, structured process from initial application to final submission.
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
              {/* Connector line - desktop only */}
              {i < steps.length - 1 && (
                <div className="absolute left-[calc(50%+28px)] top-7 hidden h-[2px] w-[calc(100%-56px)] bg-border md:block" />
              )}
              
              <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-md">
                <step.icon className="h-6 w-6" />
              </div>
              <span className="mt-1 text-xs font-bold text-gold">Step {i + 1}</span>
              <h3 className="mt-2 text-sm font-bold">{step.title}</h3>
              <p className="mt-1 max-w-[160px] text-xs leading-relaxed text-muted-foreground">{step.desc}</p>

              {/* Connector line - mobile only */}
              {i < steps.length - 1 && (
                <div className="my-3 h-6 w-[2px] bg-border md:hidden" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
