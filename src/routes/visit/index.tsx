import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Search, MapPin, Plane, ArrowRight, Clock, X, Globe, CheckCircle2, Calendar,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { visitDestinations, VISIT_COUNTRIES, VISIT_TYPES, VISIT_PURPOSES } from "@/lib/visit-data";

export const Route = createFileRoute("/visit/")({
  head: () => ({
    meta: [
      { title: "Visit Visa Destinations — Tourist, Family & Business | Global Link Migration Services" },
      { name: "description", content: "Explore visit visa options across Canada, UK, Schengen, USA, Australia, UAE and more. Find the right tourist, family or business visa for your trip." },
      { property: "og:title", content: "Visit Visa Destinations — Tourist, Family & Business" },
      { property: "og:description", content: "Explore visit visa options worldwide with guided application support." },
    ],
  }),
  component: VisitPage,
});

function VisitPage() {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("all");
  const [type, setType] = useState("all");
  const [purpose, setPurpose] = useState("all");
  const [multiOnly, setMultiOnly] = useState(false);

  const filtered = useMemo(() => {
    return visitDestinations.filter((d) => {
      if (search && !d.title.toLowerCase().includes(search.toLowerCase()) && !d.country.toLowerCase().includes(search.toLowerCase())) return false;
      if (country !== "all" && d.country !== country) return false;
      if (type !== "all" && d.visaType !== type) return false;
      if (purpose !== "all" && d.purpose !== purpose) return false;
      if (multiOnly && !d.multipleEntry) return false;
      return true;
    });
  }, [search, country, type, purpose, multiOnly]);

  const hasFilters = search || country !== "all" || type !== "all" || purpose !== "all" || multiOnly;

  function clearFilters() {
    setSearch("");
    setCountry("all");
    setType("all");
    setPurpose("all");
    setMultiOnly(false);
  }

  return (
    <>
      {/* Hero */}
      <section className="bg-navy-gradient py-16 text-center md:py-24">
        <div className="container-narrow">
          <div className="gold-divider mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-white md:text-5xl">
            Explore <span className="text-gradient-gold">Visit Visa</span> Options Worldwide
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/70 md:text-base">
            Tourism, family visits, business trips — find the right visit visa for your destination and purpose, with our guided support every step of the way.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/apply/visit-visa">
              <Button size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
                Start Visit Visa Application
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
              { icon: Globe, label: "Destinations", value: `${VISIT_COUNTRIES.length}+` },
              { icon: Plane, label: "Visa Options", value: `${visitDestinations.length}+` },
              { icon: CheckCircle2, label: "Multi-Entry", value: `${visitDestinations.filter((d) => d.multipleEntry).length}` },
              { icon: Clock, label: "Avg Processing", value: "2–4 wks" },
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
                <Input placeholder="Country or visa name…" className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            <div className="w-full lg:w-44">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Country</label>
              <Select value={country} onValueChange={setCountry}>
                <SelectTrigger><SelectValue placeholder="All Countries" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Countries</SelectItem>
                  {VISIT_COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full lg:w-44">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Visa Type</label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue placeholder="All Types" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {VISIT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full lg:w-48">
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Purpose</label>
              <Select value={purpose} onValueChange={setPurpose}>
                <SelectTrigger><SelectValue placeholder="All Purposes" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Purposes</SelectItem>
                  {VISIT_PURPOSES.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-3">
              <Button variant={multiOnly ? "default" : "outline"} size="sm" onClick={() => setMultiOnly(!multiOnly)} className="gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> Multi-Entry
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
            Showing <span className="font-semibold text-foreground">{filtered.length}</span> {filtered.length === 1 ? "option" : "options"}
          </p>

          {filtered.length === 0 ? (
            <div className="rounded-lg border border-dashed p-12 text-center">
              <Plane className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
              <p className="font-semibold">No visa options match your filters</p>
              <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search criteria or submit a general application.</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={clearFilters}>Clear Filters</Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((dest, i) => (
                <motion.div
                  key={dest.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.03 }}
                >
                  <Link
                    to="/visit/$destinationId"
                    params={{ destinationId: dest.id }}
                    className="card-premium flex h-full flex-col p-5 no-underline"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <Badge variant="secondary" className="text-[10px]">{dest.visaType}</Badge>
                      <div className="flex gap-1.5">
                        {dest.multipleEntry && (
                          <span className="rounded-full bg-gold/10 px-2 py-0.5 text-[10px] font-semibold text-gold">Multi-Entry</span>
                        )}
                      </div>
                    </div>
                    <h3 className="mt-3 text-sm font-bold leading-snug">{dest.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{dest.purpose}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{dest.country}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{dest.processingTime}</span>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{dest.duration}</span>
                    </div>
                    <div className="mt-2">
                      <Badge variant="outline" className="text-[10px]">Validity: {dest.validity}</Badge>
                    </div>
                    <span className="mt-auto inline-flex items-center gap-1 pt-4 text-xs font-semibold text-primary">
                      View Details <ArrowRight className="h-3 w-3" />
                    </span>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Visit Application CTA */}
      <section className="border-t bg-surface py-16">
        <div className="container-narrow text-center">
          <Plane className="mx-auto mb-4 h-10 w-10 text-gold" />
          <h2 className="text-2xl font-bold md:text-3xl">Not sure which visa fits your trip?</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted-foreground">
            Complete our guided visit visa application and we'll advise on the right visa category, documents, and timeline based on your travel plans.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/apply/visit-visa">
              <Button size="lg" className="bg-gold text-gold-foreground hover:bg-gold/90">
                Start Visit Visa Application
              </Button>
            </Link>
            <Link to="/contact">
              <Button size="lg" variant="outline">Talk to an Advisor</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-navy-gradient py-16 text-center">
        <div className="container-narrow">
          <h2 className="text-2xl font-bold text-white md:text-3xl">Looking to study or work abroad too?</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-white/70">
            Browse study programs and visa-sponsored job opportunities across multiple countries.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/study">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Browse Study Programs <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/jobs">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                Browse Jobs <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
