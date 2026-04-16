import { motion } from "framer-motion";
import { Shield, Clock, Users, Globe, Award, TrendingUp, Star } from "lucide-react";

interface SocialProofBarProps {
  /** Visual variant */
  variant?: "light" | "dark" | "card";
  /** Which metric set to show */
  context?: "work" | "study" | "jobs" | "general";
}

const METRICS = {
  work: [
    { value: "2,400+", label: "Applications Processed", icon: TrendingUp },
    { value: "15+", label: "Destination Countries", icon: Globe },
    { value: "24hr", label: "Average Response Time", icon: Clock },
    { value: "4.8/5", label: "Client Satisfaction", icon: Star },
  ],
  study: [
    { value: "1,800+", label: "Students Placed", icon: Users },
    { value: "120+", label: "Partner Universities", icon: Award },
    { value: "6", label: "Countries Covered", icon: Globe },
    { value: "4.9/5", label: "Student Rating", icon: Star },
  ],
  jobs: [
    { value: "3,500+", label: "Jobs Matched", icon: TrendingUp },
    { value: "850+", label: "Employer Partners", icon: Users },
    { value: "6", label: "Countries", icon: Globe },
    { value: "4.7/5", label: "Placement Rating", icon: Star },
  ],
  general: [
    { value: "2,400+", label: "Applications Processed", icon: TrendingUp },
    { value: "35+", label: "Countries Covered", icon: Globe },
    { value: "24hr", label: "Response Time", icon: Clock },
    { value: "98%", label: "Client Satisfaction", icon: Star },
  ],
};

const TRUST_BADGES = [
  "Verified Business",
  "Secure Data Handling",
  "Transparent Pricing",
  "Professional Team",
];

export function SocialProofBar({ variant = "light", context = "general" }: SocialProofBarProps) {
  const metrics = METRICS[context];
  const isDark = variant === "dark";
  const isCard = variant === "card";

  return (
    <motion.section
      className={`py-8 ${isDark ? "bg-primary/5 border-y border-primary-foreground/5" : isCard ? "" : "border-y bg-card"}`}
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
    >
      <div className="container mx-auto px-4">
        {/* Metrics row */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-8">
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              className="text-center"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
            >
              <div className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg ${isDark ? "bg-gold/10" : "bg-primary/5"}`}>
                <m.icon className={`h-5 w-5 ${isDark ? "text-gold" : "text-primary"}`} />
              </div>
              <p className={`text-xl font-extrabold md:text-2xl ${isDark ? "text-primary-foreground" : ""}`}>
                {m.value}
              </p>
              <p className={`mt-0.5 text-xs font-medium ${isDark ? "text-primary-foreground/50" : "text-muted-foreground"}`}>
                {m.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 md:gap-5">
          {TRUST_BADGES.map((badge) => (
            <span
              key={badge}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-medium ${
                isDark
                  ? "border-primary-foreground/10 text-primary-foreground/50"
                  : "border-border text-muted-foreground"
              }`}
            >
              <Shield className="h-3 w-3 text-gold" />
              {badge}
            </span>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
