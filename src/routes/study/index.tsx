import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search, MapPin, GraduationCap, ArrowRight, Clock, Filter, X,
  BookOpen, Globe, Award, Briefcase, DollarSign, Calendar,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { studyPrograms, STUDY_COUNTRIES, STUDY_LEVELS, STUDY_FIELDS } from "@/lib/study-data";

export const Route = createFileRoute("/study/")({
  head: () => ({
    meta: [
      { title: "Study Opportunities — International Programs | Global Link Migration Services" },
      { name: "description", content: "Discover study programs across Canada, UK, Australia, Germany, Ireland, and New Zealand. Find the right course, country, and budget for your education goals." },
      { property: "og:title", content: "Study Opportunities — International Programs" },
      { property: "og:description", content: "Discover study programs across multiple countries with visa support." },
    ],
  }),
  component: StudyPage,
});

function StudyPage() {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("all");
  const [level, setLevel] = useState("all");
  const [field, setField] = useState("all");
  const [scholarshipOnly, setScholarshipOnly] = useState(false);

  const filtered = useMemo(() => {
    return studyPrograms.filter((p) => {
      if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.institution.toLowerCase().includes(search.toLowerCase())) return false;
      if (country !== "all" && p.country !== country) return false;
      if (level !== "all" && p.level !== level) return false;
      if (field !== "all" && p.field !== field) return false;
      if (scholarshipOnly && !p.scholarshipAvailable) return false;
      return true;
    });
  }, [search, country, level, field, scholarshipOnly]);

  const hasFilters = search || country !== "all" || level !== "all" || field !== "all" || scholarshipOnly;

  function clearFilters() {
    setSearch("");
    setCountry("all");
    setLevel("all");
    setField("all");
    setScholarshipOnly(false);
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-navy-gradient py-16 text-center md:py-24">
        <div className="container-narrow">
          <div className="gold-divider mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white md:text-5xl">
            Discover <span className="text-gradient-gold">Study Opportunities</span> Worldwide
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
            Explore accredited programs across top destinations. Find the right course, country, and budget — then apply with our guided support.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/apply/study">
              <Button size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
                Start Study Application
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b bg-card py-8">
        <div className="container-narrow">
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { icon: Globe, label: "Countries", value: "6+" },
              { icon: BookOpen, label: "Programs", value: `${studyPrograms.length}+` },
              { icon: Award, label: "With Scholarships", value: `${studyPrograms.filter((p) => p.scholarshipAvailable).length}` },
              { icon: Briefcase, label: "Post-Study Work", value: "100%" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <s.icon className="mx-auto mb-2 h-5 w-5 text-gold" />
                <p className="text-xl font-bold">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b bg-card py-6">
        <div className="container-narrow">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
            <div className="flex-1">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Program or institution…" className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            <div className="w-full lg:w-44">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Country</label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger><SelectValue placeholder="All Countries" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {STUDY_COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full lg:w-44">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Level</label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger><SelectValue placeholder="All Levels" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  {STUDY_LEVELS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full lg:w-48">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Field</label>
              <Select value={field} onValueChange={setField}>
                <SelectTrigger><SelectValue placeholder="All Fields" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Fields</SelectItem>
                  {STUDY_FIELDS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-3">
              <Button variant={scholarshipOnly ? "default" : "outline"} size="sm" onClick={() => setScholarshipOnly(!scholarshipOnly)} className="gap-1.5">
                <Award className="h-3.5 w-3.5" /> Scholarships
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
            Showing <span className="font-semibold text-foreground">{filtered.length}</span> {filtered.length === 1 ? "program" : "programs"}
          </p>

          {filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed p-12 text-center">
              <GraduationCap className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="font-semibold">No programs match your filters</p>
              <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search criteria or submit a general application.</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((prog, i) => (
                <motion.div
                  key={prog.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.03 }}
                >
                  <Link
                    to="/study/$programId"
                    params={{ programId: prog.id }}
                    className="card-premium flex h-full flex-col p-5 no-underline"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <Badge variant="secondary" className="text-[10px]">{prog.level}</Badge>
                      <div className="flex gap-1.5">
                        {prog.scholarshipAvailable && (
                          <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-semibold text-gold">Scholarship</span>
                        )}
                        {prog.workPermit && (
                          <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">Work Permit</span>
                        )}
                      </div>
                    </div>
                    <h3 className="mt-3 text-sm font-bold leading-snug">{prog.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{prog.institution}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{prog.city}, {prog.country}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{prog.duration}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><DollarSign className="h-3 w-3" />{prog.tuitionRange}</span>
                    </div>
                    <div className="mt-2">
                      <Badge variant="outline" className="text-[10px]">{prog.field}</Badge>
                    </div>
                    <div className="mt-auto flex items-center gap-1 pt-4 text-[11px] text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      Intake: {prog.intake.join(", ")}
                    </div>
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

      {/* Study Application CTA */}
      <section className="border-t bg-surface py-16">
        <div className="container-narrow text-center">
          <GraduationCap className="mx-auto mb-4 h-10 w-10 text-gold" />
          <h2 className="text-2xl font-bold md:text-3xl">Not sure which program is right for you?</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            Complete our guided study application and we'll match you with suitable countries, courses, and institutions based on your profile.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/apply/study">
              <Button size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
                Start Study Application
              </Button>
            </Link>
            <Link to="/">
              <Button size="lg" variant="outline">Book Consultation</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-navy-gradient py-16 text-center">
        <div className="container-narrow">
          <h2 className="text-2xl font-bold text-white md:text-3xl">Also looking for work opportunities?</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/70">
            Browse visa-sponsored job listings across multiple countries and industries.
          </p>
          <Link to="/jobs" className="mt-6 inline-block">
            <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
              Browse Jobs <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
