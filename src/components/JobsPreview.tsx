import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { MapPin, DollarSign, ArrowRight, CheckCircle2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const jobs = [
  { title: "Farm Worker", country: "Canada", salary: "$16–$20/hr", sponsor: true, type: "Seasonal" },
  { title: "Warehouse Operative", country: "United Kingdom", salary: "£11–£14/hr", sponsor: true, type: "Full-time" },
  { title: "Meat Processing Worker", country: "Canada", salary: "$17–$22/hr", sponsor: true, type: "Full-time" },
  { title: "Hospitality Staff", country: "Australia", salary: "A$25–$30/hr", sponsor: true, type: "Full-time" },
  { title: "Construction Labourer", country: "Canada", salary: "$18–$24/hr", sponsor: true, type: "Full-time" },
  { title: "Healthcare Assistant", country: "United Kingdom", salary: "£10–£13/hr", sponsor: true, type: "Full-time" },
];

export function JobsPreview() {
  return (
    <section className="section-padding">
      <div className="container-narrow">
        <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <div className="gold-divider mb-5" />
            <h2 className="text-2xl font-bold md:text-3xl">Latest Job Opportunities</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Visa-sponsored positions across multiple countries. <strong className="text-foreground">All employers verified.</strong>
            </p>
          </div>
          <Link to="/jobs">
            <Button variant="outline" size="default">
              View All Jobs <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job, i) => (
            <motion.div
              key={job.title + i}
              className="card-premium flex flex-col p-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <div className="flex items-start justify-between">
                <h3 className="text-sm font-bold">{job.title}</h3>
                {job.sponsor && (
                  <span className="shrink-0 rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-semibold text-gold">
                    Visa Sponsored
                  </span>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.country}</span>
                <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{job.salary}</span>
                <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium">{job.type}</span>
              </div>
              <Link to="/jobs" className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                View Details <ArrowRight className="h-3 w-3" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* What happens when you find a job */}
        <motion.div
          className="mt-8 rounded-xl border border-border bg-muted/30 p-5"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h4 className="text-sm font-bold">Found a job you like? Here's what happens next:</h4>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
              <span>Click "Apply" and complete your work visa application</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
              <span>We match your profile with the employer requirements</span>
            </div>
            <div className="flex items-start gap-2 text-xs text-muted-foreground">
              <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
              <span>Receive your visa application support plan within 24 hours</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
