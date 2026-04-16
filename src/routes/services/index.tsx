import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Globe, Briefcase, ChevronRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Visa Services — Global Link Migration Services" },
      { name: "description", content: "Explore visa programs by country and visa type. Find the right immigration pathway for your goals." },
      { property: "og:title", content: "Visa Services — Global Link Migration Services" },
      { property: "og:description", content: "Explore visa programs by country and visa type." },
    ],
  }),
  component: ServicesIndexPage,
});

type ProgramSummary = {
  id: string;
  name: string;
  slug: string;
  country: string;
  visa_type: string;
  category: string | null;
  tagline: string | null;
  best_for: string | null;
  processing_time: string | null;
  service_fee: number | null;
  currency: string | null;
  featured: boolean;
};

function ServicesIndexPage() {
  const [programs, setPrograms] = useState<ProgramSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCountry, setSelectedCountry] = useState("all");
  const [selectedVisa, setSelectedVisa] = useState("all");

  useEffect(() => {
    supabase
      .from("programs")
      .select("id, name, slug, country, visa_type, category, tagline, best_for, processing_time, service_fee, currency, featured")
      .eq("status", "active")
      .order("featured", { ascending: false })
      .order("country")
      .order("name")
      .then(({ data }) => {
        setPrograms(data || []);
        setLoading(false);
      });
  }, []);

  const countries = [...new Set(programs.map((p) => p.country))];
  const visaTypes = [...new Set(programs.map((p) => p.visa_type))];

  const filtered = programs.filter((p) => {
    if (selectedCountry !== "all" && p.country !== selectedCountry) return false;
    if (selectedVisa !== "all" && p.visa_type !== selectedVisa) return false;
    return true;
  });

  // Group by country → visa type
  const grouped: Record<string, Record<string, ProgramSummary[]>> = {};
  filtered.forEach((p) => {
    if (!grouped[p.country]) grouped[p.country] = {};
    if (!grouped[p.country][p.visa_type]) grouped[p.country][p.visa_type] = [];
    grouped[p.country][p.visa_type].push(p);
  });

  return (
    <div>
      {/* Hero */}
      <section className="bg-navy-gradient text-primary-foreground py-16 lg:py-24">
        <div className="container-narrow text-center">
          <Badge className="bg-gold/20 text-gold border-gold/30 mb-4">Immigration Services</Badge>
          <h1 className="text-3xl font-bold tracking-tight lg:text-5xl mb-4 font-heading">Visa Programs & Services</h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto mb-8">
            Explore available visa programs by country and visa type. Find the right immigration pathway for your qualifications, goals, and career.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/apply/work-visa"><Button variant="heroGold" size="lg">Start Application</Button></Link>
            <Button variant="heroOutline" size="lg">Book Consultation</Button>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="border-b bg-card">
        <div className="container-narrow py-6">
          <div className="flex flex-wrap items-center gap-4">
            <p className="text-sm font-medium text-muted-foreground">Filter programs:</p>
            <Select value={selectedCountry} onValueChange={setSelectedCountry}>
              <SelectTrigger className="w-44"><Globe className="mr-2 h-4 w-4" /><SelectValue placeholder="Country" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Countries</SelectItem>
                {countries.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedVisa} onValueChange={setSelectedVisa}>
              <SelectTrigger className="w-44"><Briefcase className="mr-2 h-4 w-4" /><SelectValue placeholder="Visa Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Visa Types</SelectItem>
                {visaTypes.map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
            {(selectedCountry !== "all" || selectedVisa !== "all") && (
              <Button variant="ghost" size="sm" onClick={() => { setSelectedCountry("all"); setSelectedVisa("all"); }}>
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Programs */}
      {/* Category Pages */}
      <section className="container-narrow pt-12 lg:pt-16 pb-8">
        <h2 className="text-xl font-bold mb-4 font-heading">Browse by Category</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {[
            { label: "🇨🇦 Canada Work Visa", to: "/services/canada-work-visa" },
            { label: "🇬🇧 UK Study Visa", to: "/services/uk-study-visa" },
            { label: "🇦🇺 Australia Work Visa", to: "/services/australia-work-visa" },
            { label: "🇩🇪 Germany Work Visa", to: "/services/germany-work-visa" },
            { label: "🇦🇪 UAE Work Visa", to: "/services/uae-work-visa" },
          ].map((cat) => (
            <Link key={cat.to} to={cat.to}>
              <Card className="transition-shadow hover:shadow-md cursor-pointer group">
                <CardContent className="p-4 flex items-center justify-between">
                  <span className="text-sm font-medium group-hover:text-primary transition-colors">{cat.label}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <div className="container-narrow pb-12 lg:pb-16">
        {loading ? (
          <p className="text-center text-muted-foreground py-12">Loading programs...</p>
        ) : Object.keys(grouped).length === 0 ? (
          <p className="text-center text-muted-foreground py-12">No programs found for the selected filters.</p>
        ) : (
          <div className="space-y-12">
            {Object.entries(grouped).map(([country, visaGroups]) => (
              <div key={country}>
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/10">
                    <Globe className="h-5 w-5 text-gold" />
                  </div>
                  <h2 className="text-2xl font-bold font-heading">{country}</h2>
                </div>
                {Object.entries(visaGroups).map(([visaType, progs]) => (
                  <div key={visaType} className="mb-8 ml-4 lg:ml-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />{visaType}
                      <Badge variant="secondary" className="text-xs">{progs.length} program{progs.length !== 1 ? "s" : ""}</Badge>
                    </h3>
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {progs.map((p) => (
                        <Link key={p.id} to="/services/$slug" params={{ slug: p.slug }}>
                          <Card className="h-full transition-shadow hover:shadow-lg cursor-pointer group">
                            <CardContent className="p-6 flex flex-col h-full">
                              {p.featured && <Badge className="w-fit mb-2 bg-gold/10 text-gold border-gold/20 text-xs">★ Featured</Badge>}
                              <h4 className="font-semibold mb-2 group-hover:text-primary transition-colors">{p.name}</h4>
                              {p.tagline && <p className="text-sm text-muted-foreground mb-3 flex-1">{p.tagline}</p>}
                              {p.best_for && <p className="text-xs text-muted-foreground mb-3"><span className="font-medium">Best for:</span> {p.best_for}</p>}
                              <div className="flex items-center justify-between mt-auto pt-3 border-t">
                                <div className="flex gap-3 text-xs text-muted-foreground">
                                  {p.processing_time && <span>{p.processing_time}</span>}
                                  {p.service_fee && <span>{p.currency} {p.service_fee.toLocaleString()}</span>}
                                </div>
                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
