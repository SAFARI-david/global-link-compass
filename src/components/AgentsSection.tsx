import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Users, FolderOpen, BarChart3, MessageSquare, ArrowRight, CheckCircle2, Shield } from "lucide-react";
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
              Immigration agents and consultants can register for a dedicated portal to submit applications, 
              track client progress, and manage documents — all in one professional system.
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
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/agents/register">
                <Button variant="gold" size="lg">
                  Register as Agent <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/agents/login">
                <Button variant="outline" size="lg">
                  Agent Sign In
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
            <h3 className="mt-5 text-lg font-bold">What Happens After You Register</h3>
            <div className="mt-4 space-y-3 text-sm text-primary-foreground/70">
              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/20 text-[10px] font-bold text-gold">1</span>
                <span>Create your agent account (takes 2 minutes)</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/20 text-[10px] font-bold text-gold">2</span>
                <span>Our team verifies your credentials within 24 hours</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/20 text-[10px] font-bold text-gold">3</span>
                <span>Access your full dashboard to start submitting client applications</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gold/20 text-[10px] font-bold text-gold">4</span>
                <span>Earn commissions and track payments transparently</span>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-2 border-t border-primary-foreground/10 pt-4 text-xs text-primary-foreground/40">
              <Shield className="h-3.5 w-3.5 text-gold" />
              Free to register. No upfront fees for agents.
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
