import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, DollarSign, ArrowRight, Briefcase, Filter, X, CheckCircle2, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { jobs, COUNTRIES, CATEGORIES, JOB_TYPES } from "@/lib/jobs-data";

export const Route = createFileRoute("/jobs/")({
  head: () => ({
    meta: [
      { title: "Jobs — Visa-Sponsored Opportunities | Global Link Migration Services" },
      { name: "description", content: "Browse visa-sponsored job opportunities across Canada, UK, Australia, New Zealand, Germany, and Ireland. Filter by country, category, salary, and more." },
      { property: "og:title", content: "Jobs — Visa-Sponsored Opportunities" },
      { property: "og:description", content: "Browse visa-sponsored job opportunities across multiple countries." },
    ],
  }),
  component: JobsPage,
});

function JobsPage() {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("all");
  const [category, setCategory] = useState("all");
  const [type, setType] = useState("all");
  const [sponsoredOnly, setSponsoredOnly] = useState(false);

  const filtered = useMemo(() => {
    return jobs.filter((j) => {
      if (search && !j.title.toLowerCase().includes(search.toLowerCase()) && !j.employer.toLowerCase().includes(search.toLowerCase())) return false;
      if (country !== "all" && j.country !== country) return false;
      if (category !== "all" && j.category !== category) return false;
      if (type !== "all" && j.type !== type) return false;
      if (sponsoredOnly && !j.sponsored) return false;
      return true;
    });
  }, [search, country, category, type, sponsoredOnly]);

  const hasFilters = search || country !== "all" || category !== "all" || type !== "all" || sponsoredOnly;

  function clearFilters() {
    setSearch("");
    setCountry("all");
    setCategory("all");
    setType("all");
    setSponsoredOnly(false);
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-navy-gradient py-16 text-center md:py-24">
        <div className="container-narrow">
          <div className="gold-divider mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white md:text-5xl">
            Find Visa-Sponsored <span className="text-gradient-gold">Job Opportunities</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
            Browse open positions with employers who provide work visa sponsorship. Filter by country, category, and job type.
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b bg-card py-6">
        <div className="container-narrow">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            {/* Search */}
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Job title or employer…"
                  className="pl-10"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Country */}
            <div className="w-full lg:w-44">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Country</label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger><SelectValue placeholder="All Countries" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Category */}
            <div className="w-full lg:w-44">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger><SelectValue placeholder="All Categories" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Type */}
            <div className="w-full lg:w-40">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Job Type</label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue placeholder="All Types" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {JOB_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {/* Sponsored toggle */}
            <div className="flex items-end gap-3">
              <Button
                variant={sponsoredOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setSponsoredOnly(!sponsoredOnly)}
                className="gap-1.5"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Visa Sponsored
              </Button>
              {hasFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="gap-1 text-muted-foreground">
                  <X className="h-3.5 w-3.5" /> Clear
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="section-padding">
        <div className="container-narrow">
          <p className="mb-6 text-sm text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{filtered.length}</span> {filtered.length === 1 ? "position" : "positions"}
          </p>

          {filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed p-12 text-center">
              <Briefcase className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="font-semibold">No jobs match your filters</p>
              <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search criteria.</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((job, i) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.03 }}
                >
                  <Link
                    to="/jobs/$jobId"
                    params={{ jobId: job.id }}
                    className="card-premium flex h-full flex-col p-5 no-underline"
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold leading-snug">{job.title}</h3>
                      {job.sponsored && (
                        <span className="shrink-0 rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-semibold text-gold">
                          Visa Sponsored
                        </span>
                      )}
                    </div>

                    {/* Employer */}
                    <p className="mt-1 text-xs text-muted-foreground">{job.employer}</p>

                    {/* Meta */}
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                      <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{job.salary}</span>
                    </div>

                    {/* Badges */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <Badge variant="secondary" className="text-[10px]">{job.type}</Badge>
                      <Badge variant="secondary" className="text-[10px]">{job.category}</Badge>
                      {job.accommodation && <Badge variant="outline" className="text-[10px]">🏠 Accommodation</Badge>}
                    </div>

                    {/* Deadline */}
                    <div className="mt-auto flex items-center gap-1 pt-4 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      Deadline: {new Date(job.deadline).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </div>

                    {/* CTA */}
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                      View Details <ArrowRight className="h-3 w-3" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-navy-gradient py-16 text-center">
        <div className="container-narrow">
          <h2 className="text-2xl font-bold text-white md:text-3xl">Can't find the right job?</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/70">
            Submit a general work visa application and our team will match you with suitable employers and opportunities.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/apply/work-visa">
              <Button size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">Apply for Work Visa</Button>
            </Link>
            <Link to="/">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Book Consultation
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
