import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, CheckCircle2, Shield, Clock, Globe, Phone,
  FileText, Users, Briefcase, AlertTriangle, ChevronDown,
  MapPin, BadgeCheck, HelpCircle, Search, Building2, Plane,
} from "lucide-react";
import { SocialProofBar } from "@/components/SocialProofBar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/lp/jobs")({
  head: () => ({
    meta: [
      { title: "Visa-Sponsored Jobs — Apply Now | Global Link Migration" },
      { name: "description", content: "Find visa-sponsored jobs in Canada, UK, UAE, Australia & more. Professional job placement support with clear pricing." },
      { property: "og:title", content: "Find Visa-Sponsored Jobs Abroad" },
      { property: "og:description", content: "Get matched with visa-sponsored job opportunities and receive professional placement support." },
    ],
  }),
  component: JobsLP,
});

const PROCESS_STEPS = [
  { num: "01", title: "Submit Your Profile", desc: "Tell us about your skills, experience, and preferred destination." },
  { num: "02", title: "Job Matching", desc: "We search for visa-sponsored positions that match your profile." },
  { num: "03", title: "Application Support", desc: "Get help preparing your CV, cover letter, and supporting documents." },
  { num: "04", title: "Interview Preparation", desc: "Coaching and guidance to help you prepare for employer interviews." },
  { num: "05", title: "Visa & Relocation", desc: "Assistance with work visa application and relocation planning." },
];

const WHAT_YOU_GET = [
  { icon: Search, title: "Job Search & Matching", desc: "Targeted search for visa-sponsored positions in your field and preferred country" },
  { icon: FileText, title: "CV & Profile Optimisation", desc: "Professional guidance to make your application stand out to employers" },
  { icon: Building2, title: "Employer Connections", desc: "Access to our network of employers offering visa sponsorship" },
  { icon: Users, title: "Interview Coaching", desc: "Preparation and coaching for employer interviews" },
  { icon: Shield, title: "Visa Application Support", desc: "Professional support with your work visa application" },
  { icon: Plane, title: "Relocation Guidance", desc: "Help planning your move including accommodation and settling in" },
];

const WHO_ITS_FOR = [
  "Professionals seeking international career opportunities",
  "Skilled workers looking for employer-sponsored visas",
  "Candidates open to relocating for the right opportunity",
  "Job seekers who want structured, professional placement support",
];

const DESTINATIONS = ["Canada", "United Kingdom", "UAE", "Australia", "Germany", "Saudi Arabia"];

const INDUSTRIES = [
  "IT & Software", "Healthcare & Nursing", "Engineering",
  "Hospitality & Tourism", "Finance & Accounting", "Construction",
  "Education", "Manufacturing", "Other",
];

const FAQS = [
  {
    q: "What does the service fee cover?",
    a: "The service fee covers job search and matching, CV optimisation, interview coaching, visa application support, and relocation guidance. Employer fees, government visa fees, and travel costs are NOT included.",
  },
  {
    q: "Do you guarantee a job placement?",
    a: "No. Hiring decisions are made by employers. We provide professional support to maximise your chances, but we cannot guarantee specific outcomes.",
  },
  {
    q: "Are government visa fees included?",
    a: "No. Government visa fees, health checks, language tests, and other third-party costs are separate and must be paid by the applicant.",
  },
  {
    q: "How long does it take to find a job?",
    a: "Timelines vary based on your skills, experience, and target country. Typically 4–16 weeks from profile submission to job offer, plus visa processing time.",
  },
  {
    q: "What countries do you cover?",
    a: "We currently support job placements in Canada, UK, UAE, Australia, Germany, and Saudi Arabia. Contact us for other destinations.",
  },
  {
    q: "Do I need work experience?",
    a: "Requirements vary by position and destination. Some roles accept entry-level candidates, while others require 2+ years of experience. We'll match you with appropriate opportunities.",
  },
];

const FORM_COUNTRIES = [
  "Nigeria", "India", "Pakistan", "Philippines", "Kenya",
  "Ghana", "Bangladesh", "Egypt", "South Africa", "Other",
];

function JobsLP() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [destination, setDestination] = useState("");
  const [industry, setIndustry] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const isValid = name.trim().length >= 2 && country && phone.trim().length >= 6;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid || submitting) return;
    setSubmitting(true);

    const params = new URLSearchParams(window.location.search);

    const { data, error } = await supabase.from("leads").insert({
      name: name.trim(),
      email: "",
      source: "jobs-lp",
      interest: "jobs",
      country,
      phone: phone.trim(),
      status: "new",
      form_data: { destination, industry, phone: phone.trim(), country },
      utm_source: params.get("utm_source") || null,
      utm_medium: params.get("utm_medium") || null,
      utm_campaign: params.get("utm_campaign") || null,
    } as any).select("id").single();

    if (error) {
      toast.error("Something went wrong. Please try again.");
      setSubmitting(false);
      return;
    }

    setSubmitted(true);
    setTimeout(() => {
      navigate({ to: "/jobs", search: { lead: data?.id } } as any);
    }, 2500);
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Thank you, {name}!</h2>
          <p className="text-muted-foreground mb-4">Taking you to browse matching opportunities…</p>
          <div className="h-1 w-32 mx-auto rounded-full bg-primary/20 overflow-hidden">
            <motion.div className="h-full bg-primary rounded-full" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2 }} />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto flex h-14 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Globe className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-bold">Global Link Migration</span>
          </Link>
          <a href="#apply-form">
            <Button size="sm" variant="gold">Start Your Application</Button>
          </a>
        </div>
      </div>

      {/* HERO */}
      <section className="relative overflow-hidden bg-navy-gradient">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-gold blur-[100px]" />
          <div className="absolute -left-20 bottom-0 h-60 w-60 rounded-full bg-primary-foreground blur-[80px]" />
        </div>
        <div className="container mx-auto relative z-10 px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-foreground/10 bg-primary-foreground/5 px-4 py-1.5 text-xs font-medium text-primary-foreground/80">
                <Briefcase className="h-3.5 w-3.5" /> Visa-Sponsored Job Placement
              </div>
            </motion.div>
            <motion.h1
              className="text-3xl font-extrabold leading-tight tracking-tight text-primary-foreground md:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            >
              Find <span className="text-gradient-gold">Visa-Sponsored Jobs</span> Abroad
            </motion.h1>
            <motion.p
              className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-primary-foreground/70 md:text-lg"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            >
              Get matched with employers offering visa sponsorship. Professional support from job search to relocation.
            </motion.p>
            <motion.div className="mt-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <a href="#apply-form">
                <Button variant="heroGold" size="xl">Start Your Application <ArrowRight className="ml-1 h-5 w-5" /></Button>
              </a>
            </motion.div>
            <motion.div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              {["Employer-sponsored positions", "Multiple countries", "Full placement support"].map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-xs text-primary-foreground/60">
                  <CheckCircle2 className="h-3.5 w-3.5 text-gold" /> {t}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <SocialProofBar context="jobs" />

      {/* Destinations bar */}
      <section className="border-b bg-card py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
            {DESTINATIONS.map((c) => (
              <span key={c} className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary" /> {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* WHO THIS IS FOR */}
      <section className="section-padding bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold md:text-3xl">Who This Is For</h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {WHO_ITS_FOR.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-xl border bg-card p-4 text-left">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      <section className="section-padding">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-center text-2xl font-bold md:text-3xl">What You Get</h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {WHAT_YOU_GET.map((item) => (
                <Card key={item.title} className="text-center">
                  <CardContent className="p-6">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-sm font-bold">{item.title}</h3>
                    <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="section-padding bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl font-bold md:text-3xl">How It Works</h2>
            <div className="mt-10 space-y-0">
              {PROCESS_STEPS.map((step, i) => (
                <div key={step.num} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">{step.num}</div>
                    {i < PROCESS_STEPS.length - 1 && <div className="w-px flex-1 bg-border" />}
                  </div>
                  <div className="pb-8">
                    <h3 className="text-sm font-bold">{step.title}</h3>
                    <p className="mt-1 text-xs text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="section-padding">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-center text-2xl font-bold md:text-3xl">Transparent Pricing</h2>
            <Card className="mt-8 border-2 border-gold/30">
              <CardContent className="p-8 text-center">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Our Service Fee</p>
                <p className="mt-2 text-5xl font-extrabold">$750</p>
                <p className="mt-1 text-sm text-muted-foreground">USD • One-time payment</p>

                <div className="mt-6 space-y-2 text-left">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Included in service fee:</h4>
                  {["Job search & employer matching", "CV & profile optimisation", "Interview preparation & coaching", "Visa application support", "Relocation guidance"].map((item) => (
                    <div key={item} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500" /> {item}
                    </div>
                  ))}
                </div>

                <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50/50 p-4 text-left">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    <div>
                      <p className="text-sm font-semibold text-amber-800">Important</p>
                      <p className="mt-1 text-xs text-amber-700 leading-relaxed">
                        Government visa fees, health checks, language tests, travel, accommodation, and other third-party costs are <strong>NOT included</strong> and must be paid separately.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* LEAD FORM */}
      <section id="apply-form" className="section-padding bg-navy-gradient scroll-mt-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-lg">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-primary-foreground md:text-3xl">Start Your Application</h2>
              <p className="mt-2 text-sm text-primary-foreground/60">Tell us about your skills and we'll find matching opportunities</p>
            </div>
            <Card className="border-primary-foreground/10 bg-primary-foreground/5 shadow-2xl">
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label className="text-xs text-primary-foreground/70">Full Name *</Label>
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" className="mt-1 border-primary-foreground/10 bg-primary-foreground/5 text-primary-foreground placeholder:text-primary-foreground/30" required maxLength={100} />
                  </div>
                  <div>
                    <Label className="text-xs text-primary-foreground/70">Your Country *</Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger className="mt-1 border-primary-foreground/10 bg-primary-foreground/5 text-primary-foreground"><SelectValue placeholder="Select your country" /></SelectTrigger>
                      <SelectContent>{FORM_COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-primary-foreground/70">Phone Number *</Label>
                    <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 234 567 8900" className="mt-1 border-primary-foreground/10 bg-primary-foreground/5 text-primary-foreground placeholder:text-primary-foreground/30" required maxLength={20} />
                  </div>
                  <div>
                    <Label className="text-xs text-primary-foreground/70">Where do you want to work?</Label>
                    <Select value={destination} onValueChange={setDestination}>
                      <SelectTrigger className="mt-1 border-primary-foreground/10 bg-primary-foreground/5 text-primary-foreground"><SelectValue placeholder="Select country…" /></SelectTrigger>
                      <SelectContent>
                        {DESTINATIONS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        <SelectItem value="Anywhere">Anywhere</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-primary-foreground/70">Your industry / profession</Label>
                    <Select value={industry} onValueChange={setIndustry}>
                      <SelectTrigger className="mt-1 border-primary-foreground/10 bg-primary-foreground/5 text-primary-foreground"><SelectValue placeholder="Select…" /></SelectTrigger>
                      <SelectContent>
                        {INDUSTRIES.map((ind) => <SelectItem key={ind} value={ind}>{ind}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" variant="heroGold" size="lg" className="w-full mt-2" disabled={!isValid || submitting}>
                    {submitting ? "Saving…" : <>Continue Application <ArrowRight className="ml-1 h-4 w-4" /></>}
                  </Button>
                  <p className="text-center text-[11px] text-primary-foreground/40">Your data is private and secure. Service fees apply separately.</p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-center text-2xl font-bold md:text-3xl">Frequently Asked Questions</h2>
            <div className="mt-8 space-y-3">
              {FAQS.map((faq) => (
                <Collapsible key={faq.q}>
                  <Card>
                    <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-left">
                      <span className="flex items-center gap-2 text-sm font-medium"><HelpCircle className="h-4 w-4 shrink-0 text-primary" />{faq.q}</span>
                      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform data-[state=open]:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent><div className="px-4 pb-4 pl-10"><p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p></div></CollapsibleContent>
                  </Card>
                </Collapsible>
              ))}
            </div>
            <Card className="mt-8 border-amber-200/60 bg-amber-50/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  <p className="text-xs leading-relaxed text-amber-800">
                    <strong>Disclaimer:</strong> Global Link Migration Services provides professional job placement and visa support. We do not guarantee job placement or visa approval. Hiring decisions are made by employers and visa decisions by immigration authorities.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="section-padding bg-navy-gradient">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-primary-foreground md:text-3xl">Find Your Next Opportunity Today</h2>
            <p className="mt-3 text-sm text-primary-foreground/60">Take the first step towards an international career with professional support.</p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a href="#apply-form"><Button variant="heroGold" size="xl">Start Application <ArrowRight className="ml-1 h-5 w-5" /></Button></a>
              <Link to="/advisor"><Button variant="heroOutline" size="xl">Book Consultation</Button></Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t bg-card py-6">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Global Link Migration Services. All rights reserved.</p>
          <p className="mt-1">Professional visa and job placement support services.</p>
        </div>
      </footer>
    </div>
  );
}
