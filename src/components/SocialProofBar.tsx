import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Shield, Clock, Users, Globe, Award, TrendingUp, Star } from "lucide-react";

interface SocialProofBarProps {
  variant?: "light" | "dark" | "card";
  context?: "work" | "study" | "jobs" | "general";
}

/** Parse a display value like "2,400+" into { num: 2400, prefix: "", suffix: "+" } */
function parseMetricValue(val: string) {
  const match = val.match(/^([^\d]*)(\d[\d,.]*)([^\d]*)$/);
  if (!match) return { num: 0, prefix: "", suffix: "", decimals: 0 };
  const prefix = match[1];
  const raw = match[2].replace(/,/g, "");
  const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
  return { num: parseFloat(raw), prefix, suffix: match[3], decimals };
}

function formatNum(n: number, decimals: number) {
  const fixed = n.toFixed(decimals);
  const [int, dec] = fixed.split(".");
  const withCommas = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return dec ? `${withCommas}.${dec}` : withCommas;
}

function AnimatedCounter({ value, isDark }: { value: string; isDark: boolean }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState("0");
  const parsed = useRef(parseMetricValue(value));

  useEffect(() => {
    if (!isInView) return;
    const { num, decimals } = parsed.current;
    if (num === 0) { setDisplay(value); return; }

    const duration = 1600;
    const fps = 60;
    const totalFrames = Math.round((duration / 1000) * fps);
    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * num;
      setDisplay(formatNum(current, decimals));
      if (frame >= totalFrames) {
        setDisplay(formatNum(num, decimals));
        clearInterval(counter);
      }
    }, 1000 / fps);

    return () => clearInterval(counter);
  }, [isInView, value]);

  const { prefix, suffix } = parsed.current;

  return (
    <p ref={ref} className={`text-xl font-extrabold tabular-nums md:text-2xl ${isDark ? "text-primary-foreground" : ""}`}>
      {prefix}{display}{suffix}
    </p>
  );
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
              <AnimatedCounter value={m.value} isDark={isDark} />
              <p className={`mt-0.5 text-xs font-medium ${isDark ? "text-primary-foreground/50" : "text-muted-foreground"}`}>
                {m.label}
              </p>
            </motion.div>
          ))}
        </div>

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
