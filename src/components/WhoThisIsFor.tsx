import { motion } from "framer-motion";
import { Briefcase, GraduationCap, Plane, Users, Building2, Heart } from "lucide-react";

const personas = [
  {
    icon: Briefcase,
    title: "Skilled Workers",
    description: "Nurses, engineers, IT professionals, tradespeople and care workers seeking sponsored roles abroad.",
  },
  {
    icon: GraduationCap,
    title: "Students & Graduates",
    description: "Anyone applying to universities or post-study work routes in the UK, Canada, Australia or Germany.",
  },
  {
    icon: Heart,
    title: "Families Reuniting",
    description: "Spouses, partners and dependants joining loved ones already living and working overseas.",
  },
  {
    icon: Plane,
    title: "Visitors & Travellers",
    description: "Tourists, business travellers and family members applying for short-stay visit visas.",
  },
  {
    icon: Building2,
    title: "Employers & Sponsors",
    description: "Companies recruiting international talent and managing licensed sponsorship obligations.",
  },
  {
    icon: Users,
    title: "Migration Agents",
    description: "Independent agents and consultancies who want a trusted partner to process applications at scale.",
  },
];

export function WhoThisIsFor() {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container-narrow">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-gold">
            Who This Is For
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            Built for serious applicants — not tyre-kickers.
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            We work with people who are ready to move forward. If any of these sound like you, you're in the right place.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {personas.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-gold/40 hover:shadow-lg"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-lg bg-gold/10 text-gold transition-colors group-hover:bg-gold group-hover:text-gold-foreground">
                <p.icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold text-foreground">{p.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{p.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 text-center text-sm font-medium text-muted-foreground"
        >
          Visa rules change frequently. <span className="font-bold text-foreground">Apply now</span> while current pathways remain open.
        </motion.p>
      </div>
    </section>
  );
}
