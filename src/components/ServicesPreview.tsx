import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Briefcase, Globe, Award } from "lucide-react";

const canadaPrograms = [
  {
    icon: Briefcase,
    title: "LMIA Program",
    desc: "Employer-sponsored Labour Market Impact Assessment work permits for skilled and essential roles in Canada.",
    slug: "canada-lmia-program",
  },
  {
    icon: Globe,
    title: "Francophone Mobility Program",
    desc: "LMIA-exempt fast-track work permit pathway for French-speaking professionals heading to Canada.",
    slug: "canada-francophone-mobility",
  },
  {
    icon: Award,
    title: "Express Entry",
    desc: "Points-based federal program leading to permanent residence for skilled workers — with or without a job offer.",
    slug: "canada-express-entry",
  },
];

export function ServicesPreview() {
  return (
    <section className="section-padding">
      <div className="container-narrow">
        <div className="mx-auto max-w-2xl text-center">
          <div className="gold-divider mx-auto mb-5" />
          <h2 className="text-2xl font-bold md:text-3xl">Canada Work Visa Programs</h2>
          <p className="mt-3 text-sm text-muted-foreground md:text-base">
            Explore the main Canada work visa pathways we support. Compare programs, then start your application with structured guidance.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {canadaPrograms.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Link
                to="/services/$slug"
                params={{ slug: s.slug }}
                className="card-premium group flex h-full flex-col p-6"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gold/10">
                  <s.icon className="h-5 w-5 text-gold" />
                </div>
                <h3 className="mt-4 text-base font-bold">{s.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary transition-all group-hover:gap-2">
                  View program <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            to="/services/canada-work-visa"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:gap-2 transition-all"
          >
            See all Canada work visa programs <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
