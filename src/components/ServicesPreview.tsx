import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

const servicesPrev = [
  {
    title: "Canada Work Visa — LMIA",
    desc: "Employer-sponsored Labour Market Impact Assessment applications for skilled and unskilled workers.",
    to: "/work-visas",
  },
  {
    title: "Study Visa Programs",
    desc: "Complete application support for international students seeking admission and study permits.",
    to: "/study-visas",
  },
  {
    title: "Visit Visa Applications",
    desc: "Tourist and family visit visa applications with structured document preparation.",
    to: "/visit-visas",
  },
];

export function ServicesPreview() {
  return (
    <section className="section-padding">
      <div className="container-narrow">
        <div className="mx-auto max-w-2xl text-center">
          <div className="gold-divider mx-auto mb-5" />
          <h2 className="text-2xl font-bold md:text-3xl">Our Services</h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {servicesPrev.map((s, i) => (
            <motion.div
              key={s.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Link to={s.to} className="card-premium group flex h-full flex-col p-6">
                <h3 className="text-base font-bold">{s.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary transition-all group-hover:gap-2">
                  Start Application <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
