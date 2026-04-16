import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Users, FolderOpen, BarChart3, MessageSquare, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const agentFeatures = [
  { icon: FolderOpen, text: "Submit & manage client applications" },
  { icon: BarChart3, text: "Track statuses & payment per client" },
  { icon: MessageSquare, text: "Communicate directly with our team" },
  { icon: Users, text: "Manage your full client portfolio" },
];

export function AgentsSection() {
  return (
    <section className="section-padding">
      <div className="container-narrow">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="gold-divider mb-5" />
            <h2 className="text-2xl font-bold md:text-3xl">Partner With Us as an Agent</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Immigration agents and consultants can register for a dedicated portal to submit applications, track client progress, and manage documents — all in one professional system.
            </p>
            <ul className="mt-6 flex flex-col gap-3">
              {agentFeatures.map((f) => (
                <li key={f.text} className="flex items-center gap-3 text-sm">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gold/10">
                    <f.icon className="h-4 w-4 text-gold" />
                  </div>
                  {f.text}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Link to="/agents">
                <Button variant="gold" size="lg">
                  Join as Agent <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="rounded-2xl bg-navy-gradient p-8 text-primary-foreground"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-foreground/10">
              <Users className="h-6 w-6 text-gold" />
            </div>
            <h3 className="mt-5 text-lg font-bold">Agent Portal Benefits</h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-primary-foreground/70">
              <li>• Dedicated dashboard with full client management</li>
              <li>• Bulk application submission tools</li>
              <li>• Real-time status tracking per client</li>
              <li>• Invoice and payment visibility</li>
              <li>• Direct communication channel with admin</li>
              <li>• Document upload and management</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
