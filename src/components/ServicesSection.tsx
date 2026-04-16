import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Plane, Users, ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "@tanstack/react-router";

const services = [
  {
    icon: Briefcase,
    title: "Work Visa Support",
    desc: "LMIA applications, skilled worker programs, employer-sponsored work permits, and international job placement support.",
    includes: ["Eligibility assessment", "Document preparation", "Employer matching"],
    to: "/apply/work-visa",
    cta: "Start Work Visa Application",
  },
  {
    icon: GraduationCap,
    title: "Study Visa Support",
    desc: "University admissions, student visa applications, program matching, and scholarship guidance for international students.",
    includes: ["Program matching", "Admission support", "Visa filing"],
    to: "/apply/study",
    cta: "Start Study Application",
  },
  {
    icon: Plane,
    title: "Job Opportunities",
    desc: "Browse visa-sponsored jobs across multiple countries, filter by industry, salary, and employer details.",
    includes: ["Verified employers", "Visa sponsorship", "Salary transparency"],
    to: "/jobs",
    cta: "Browse Jobs",
  },
  {
    icon: Users,
    title: "Agent Partnership",
    desc: "Dedicated portal for agents to submit applications, track client statuses, and manage documents at scale.",
    includes: ["Bulk submissions", "Client tracking", "Commission dashboard"],
    to: "/agents/register",
    cta: "Register as Agent",
  },
];

export function ServicesSection() {
  return (
    <section className="section-padding bg-surface">
      <div className="container-narrow">
        <div className="mx-auto max-w-2xl text-center">
          <div className="gold-divider mx-auto mb-5" />
          <h2 className="text-2xl font-bold md:text-3xl">What We Do</h2>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            Comprehensive immigration and international opportunity services. 
            Every service follows a <strong className="text-foreground">clear, guided process</strong> from start to finish.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Link to={s.to} className="card-premium group flex h-full flex-col p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/5">
                  <s.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-base font-bold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                
                {/* What's included */}
                <ul className="mt-3 flex flex-col gap-1.5">
                  {s.includes.map((item) => (
                    <li key={item} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <CheckCircle2 className="h-3 w-3 shrink-0 text-gold" />
                      {item}
                    </li>
                  ))}
                </ul>

                <span className="mt-auto pt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary transition-all group-hover:gap-2">
                  {s.cta} <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
