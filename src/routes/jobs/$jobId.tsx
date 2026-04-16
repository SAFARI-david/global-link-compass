import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  MapPin, DollarSign, ArrowLeft, Briefcase, Calendar, CheckCircle2,
  Clock, Home, Bus, UtensilsCrossed, ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { jobs } from "@/lib/jobs-data";

export const Route = createFileRoute("/jobs/$jobId")({
  loader: ({ params }) => {
    const job = jobs.find((j) => j.id === params.jobId);
    if (!job) throw notFound();
    return job;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Job"} — Global Link Migration Services` },
      { name: "description", content: loaderData?.description?.slice(0, 155) ?? "" },
      { property: "og:title", content: loaderData?.title ?? "Job Opportunity" },
      { property: "og:description", content: loaderData?.description?.slice(0, 155) ?? "" },
    ],
  }),
  component: JobDetailPage,
  notFoundComponent: () => (
    <div className="section-padding text-center">
      <Briefcase className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
      <h1 className="text-2xl font-bold">Job Not Found</h1>
      <p className="mt-2 text-muted-foreground">This position may have been removed or the link is incorrect.</p>
      <Link to="/jobs"><Button variant="outline" className="mt-6">Browse All Jobs</Button></Link>
    </div>
  ),
});

function JobDetailPage() {
  const job = Route.useLoaderData();

  // Related jobs (same category or country, excluding self)
  const related = jobs.filter((j) => j.id !== job.id && (j.category === job.category || j.country === job.country)).slice(0, 3);

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b bg-card py-3">
        <div className="container-narrow">
          <Link to="/jobs" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Jobs
          </Link>
        </div>
      </div>

      <section className="section-padding">
        <div className="container-narrow">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {/* Header */}
              <div className="flex flex-wrap items-start gap-3">
                {job.sponsored && (
                  <span className="rounded-full bg-gold/10 px-3 py-1 text-xs font-semibold text-gold">
                    Visa Sponsored
                  </span>
                )}
                <Badge variant={job.status === "open" ? "default" : "secondary"}>
                  {job.status === "open" ? "Open" : "Closed"}
                </Badge>
              </div>

              <h1 className="mt-4 text-2xl font-bold md:text-3xl">{job.title}</h1>
              <p className="mt-1 text-base text-muted-foreground">{job.employer}</p>

              {/* Quick Meta */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{job.location}</span>
                <span className="flex items-center gap-1.5"><DollarSign className="h-4 w-4" />{job.salary}</span>
                <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" />{job.type}</span>
                <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />Deadline: {new Date(job.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
              </div>

              {/* Perks */}
              {(job.accommodation || job.transport || job.meals) && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {job.accommodation && <Badge variant="outline" className="gap-1"><Home className="h-3 w-3" /> Accommodation</Badge>}
                  {job.transport && <Badge variant="outline" className="gap-1"><Bus className="h-3 w-3" /> Transport</Badge>}
                  {job.meals && <Badge variant="outline" className="gap-1"><UtensilsCrossed className="h-3 w-3" /> Meals</Badge>}
                </div>
              )}

              <hr className="my-8" />

              {/* Description */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-lg font-bold">Job Description</h2>
                  <p className="mt-2 leading-relaxed text-muted-foreground">{job.description}</p>
                </div>

                <div>
                  <h2 className="text-lg font-bold">Responsibilities</h2>
                  <ul className="mt-2 space-y-1.5">
                    {job.responsibilities.map((r: string) => (
                      <li key={r} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {r}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className="text-lg font-bold">Requirements</h2>
                  <ul className="mt-2 space-y-1.5">
                    {job.requirements.map((r: string) => (
                      <li key={r} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {r}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className="text-lg font-bold">Benefits</h2>
                  <ul className="mt-2 space-y-1.5">
                    {job.benefits.map((b: string) => (
                      <li key={b} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {b}
                      </li>
                    ))}
                  </ul>
                </div>

                {job.sponsored && (
                  <div className="rounded-lg border border-gold/20 bg-gold/5 p-5">
                    <h3 className="flex items-center gap-2 font-bold text-gold">
                      <CheckCircle2 className="h-5 w-5" /> Visa Sponsorship Information
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      This employer provides work visa sponsorship for eligible candidates. Our team will guide you through the visa application process as part of your job application.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Sidebar */}
            <motion.div
              className="space-y-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              {/* Apply Card */}
              <div className="card-premium p-6">
                <h3 className="font-bold">Apply for this Position</h3>
                <p className="mt-1 text-xs text-muted-foreground">Submit your application and our team will follow up within 24 hours.</p>
                <Link to="/apply/work-visa" className="mt-4 block">
                  <Button className="w-full bg-gold text-gold-foreground hover:bg-gold/90">
                    Apply Now
                  </Button>
                </Link>
                <p className="mt-3 text-center text-[10px] text-muted-foreground">
                  Agents can also submit applications on behalf of clients.
                </p>
              </div>

              {/* Summary Card */}
              <div className="card-premium p-6">
                <h3 className="mb-3 font-bold">Job Summary</h3>
                <dl className="space-y-2.5 text-sm">
                  {[
                    ["Country", job.country],
                    ["Location", job.location],
                    ["Category", job.category],
                    ["Type", job.type],
                    ["Salary", job.salary],
                    ["Deadline", new Date(job.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })],
                    ["Posted", new Date(job.postedDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })],
                  ].map(([label, val]) => (
                    <div key={label} className="flex justify-between">
                      <dt className="text-muted-foreground">{label}</dt>
                      <dd className="font-medium">{val}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Trust */}
              <div className="rounded-lg border border-dashed p-4 text-center text-xs text-muted-foreground">
                <Clock className="mx-auto mb-1.5 h-4 w-4" />
                We respond within 24 hours.<br />Your data is secure.
              </div>
            </motion.div>
          </div>

          {/* Related Jobs */}
          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="text-xl font-bold">Related Opportunities</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((rj) => (
                  <Link
                    key={rj.id}
                    to="/jobs/$jobId"
                    params={{ jobId: rj.id }}
                    className="card-premium flex flex-col p-5 no-underline"
                  >
                    <h3 className="text-sm font-bold">{rj.title}</h3>
                    <p className="mt-0.5 text-xs text-muted-foreground">{rj.employer}</p>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{rj.country}</span>
                      <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{rj.salary}</span>
                    </div>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                      View Details <ArrowRight className="h-3 w-3" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Disclaimer */}
      <div className="border-t bg-muted/30 py-6">
        <div className="container-narrow text-center text-[11px] text-muted-foreground">
          We provide professional visa application support and application management services. Final decisions are made by embassies, consulates, institutions, employers, and immigration authorities.
        </div>
      </div>
    </>
  );
}
