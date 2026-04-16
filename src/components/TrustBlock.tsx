import { motion } from "framer-motion";
import { Eye, HeadphonesIcon, LayoutList, ArrowUpRight } from "lucide-react";

const trustItems = [
  { icon: Eye, title: "Transparent Process", desc: "Track your application status at every stage with complete visibility." },
  { icon: HeadphonesIcon, title: "Professional Support", desc: "Dedicated support via email, live chat, and in-dashboard messaging." },
  { icon: LayoutList, title: "Structured Applications", desc: "Guided forms ensure nothing is missed in your application." },
  { icon: ArrowUpRight, title: "Clear Next Steps", desc: "Always know exactly what happens next in your journey." },
];

export function TrustBlock() {
  return (
    <section className="section-padding bg-surface">
      <div className="container-narrow">
        <div className="mx-auto max-w-2xl text-center">
          <div className="gold-divider mx-auto mb-5" />
          <h2 className="text-2xl font-bold md:text-3xl">Why Applicants Trust Us</h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
      </div>
    </section>
  );
}
