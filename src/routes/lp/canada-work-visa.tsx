import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight, CheckCircle2, Shield, Clock, Globe, Phone,
  FileText, Users, Briefcase, Star, AlertTriangle, ChevronDown,
  MapPin, BadgeCheck, HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/lp/canada-work-visa")({
  head: () => ({
    meta: [
      { title: "Work in Canada — LMIA Program | Global Link Migration" },
      { name: "description", content: "Get step-by-step support for your Canada work visa application. Professional guidance, clear process, support at every step." },
      { property: "og:title", content: "Work in Canada with Employer-Supported Opportunities" },
      { property: "og:description", content: "Get step-by-step support for your Canada work visa application through a structured and professional process." },
    ],
  }),
  component: CanadaWorkVisaLP,
});

const PROCESS_STEPS = [
  { num: "01", title: "Submit Your Details", desc: "Fill out our short application form with your basic information." },
  { num: "02", title: "Profile Review", desc: "Our team evaluates your profile and eligibility for the program." },
  { num: "03", title: "Document Preparation", desc: "Receive a personalised document checklist and preparation guidance." },
  { num: "04", title: "Application Guidance", desc: "Step-by-step support throughout the application process." },
  { num: "05", title: "Follow-up Support", desc: "Ongoing assistance until you receive your visa decision." },
];

const WHAT_YOU_GET = [
  { icon: FileText, title: "Profile Review", desc: "Comprehensive assessment of your qualifications and eligibility" },
  { icon: BadgeCheck, title: "Document Preparation Guidance", desc: "Personalised checklist and support for all required documents" },
  { icon: Shield, title: "Application Support", desc: "Professional assistance with your complete visa application" },
  { icon: Clock, title: "Step-by-Step Process", desc: "Clear milestones and timelines so you always know what's next" },
  { icon: Users, title: "Follow-up Support", desc: "Dedicated team available for questions throughout the process" },
  { icon: Globe, title: "Post-Submission Assistance", desc: "Support continues even after your application is submitted" },
];

const WHO_ITS_FOR = [
  "Individuals seeking work opportunities abroad",
  "Applicants ready to relocate to Canada",
  "Candidates with or without prior international experience",
  "Applicants looking for structured, professional visa support",
];

const FAQS = [
  {
    q: "What does the service fee cover?",
    a: "The service fee covers professional profile review, eligibility assessment, document preparation guidance, application support, step-by-step processing assistance, and follow-up support until a decision is reached. Government, embassy, and third-party fees are NOT included.",
  },
  {
    q: "Are government and embassy fees included?",
    a: "No. Government fees, embassy fees, language test fees (IELTS/TOEFL), credential evaluation fees (WES/ECA), and other third-party costs are separate and must be paid directly by the applicant.",
  },
  {
    q: "Do you guarantee visa approval?",
    a: "No. Final visa decisions are made solely by immigration authorities, embassies, and consulates. We provide professional application support services only. We do not guarantee any specific outcome.",
  },
  {
    q: "How long does the process take?",
    a: "Processing times vary by program and individual circumstances. Typical timelines range from 8–16 weeks depending on the program, government processing times, and document readiness.",
  },
  {
    q: "Can I get a refund?",
    a: "Refund eligibility depends on the stage of processing. Contact our support team for specific refund policy details before making payment.",
  },
  {
    q: "What happens after I submit my details?",
    a: "Our team reviews your profile within 24 hours and contacts you with next steps. You'll receive a personalised document checklist and clear guidance on the process ahead.",
  },
];

const COUNTRIES = [
  "Nigeria", "India", "Pakistan", "Philippines", "Kenya",
  "Ghana", "Bangladesh", "Egypt", "South Africa", "Other",
];

function CanadaWorkVisaLP() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [interest, setInterest] = useState("");
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
      source: "canada-work-lp",
      interest: "work",
      country,
      phone: phone.trim(),
      status: "new",
      form_data: { interest: interest || "LMIA Program", phone: phone.trim(), country },
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
      navigate({ to: "/apply/work-visa", search: { lead: data?.id } } as any);
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
          <p className="text-muted-foreground mb-4">We're taking you to the full application form. Your details have been saved.</p>
          <div className="h-1 w-32 mx-auto rounded-full bg-primary/20 overflow-hidden">
            <motion.div className="h-full bg-primary rounded-full" initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 2 }} />
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Minimal header */}
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

      {/* ===== SECTION 1: HERO ===== */}
      <section className="relative overflow-hidden bg-navy-gradient">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-gold blur-[100px]" />
          <div className="absolute -left-20 bottom-0 h-60 w-60 rounded-full bg-primary-foreground blur-[80px]" />
        </div>

        <div className="container mx-auto relative z-10 px-4 py-16 md:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-primary-foreground/10 bg-primary-foreground/5 px-4 py-1.5 text-xs font-medium text-primary-foreground/80">
                <MapPin className="h-3.5 w-3.5" /> Canada Work Visa — LMIA Program
              </div>
            </motion.div>

            <motion.h1
              className="text-3xl font-extrabold leading-tight tracking-tight text-primary-foreground md:text-5xl lg:text-6xl"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            >
              Work in Canada with{" "}
              <span className="text-gradient-gold">Employer-Supported Opportunities</span>
            </motion.h1>

            <motion.p
              className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-primary-foreground/70 md:text-lg"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            >
              Get step-by-step support for your Canada work visa application through a structured and professional process.
            </motion.p>

            <motion.div
              className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            >
              <a href="#apply-form">
                <Button variant="heroGold" size="xl">
                  Start Your Application <ArrowRight className="ml-1 h-5 w-5" />
                </Button>
              </a>
            </motion.div>

            <motion.div
              className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.5 }}
            >
              {["Professional guidance", "Clear process", "Support at every step"].map((t) => (
                <span key={t} className="flex items-center gap-1.5 text-xs text-primary-foreground/60">
                  <CheckCircle2 className="h-3.5 w-3.5 text-gold" /> {t}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 2: WHO THIS IS FOR ===== */}
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

      {/* ===== SECTION 3: WHAT YOU GET ===== */}
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

      {/* ===== SECTION 4: SIMPLE PROCESS ===== */}
      <section className="section-padding bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-center text-2xl font-bold md:text-3xl">Simple, Clear Process</h2>
            <div className="mt-10 space-y-0">
              {PROCESS_STEPS.map((step, i) => (
                <div key={step.num} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                      {step.num}
                    </div>
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

      {/* ===== SECTION 5: PRICING TRANSPARENCY ===== */}
      <section className="section-padding">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-center text-2xl font-bold md:text-3xl">Transparent Pricing</h2>
            <Card className="mt-8 border-2 border-gold/30">
              <CardContent className="p-8 text-center">
                <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">Our Service Fee</p>
                <p className="mt-2 text-5xl font-extrabold">$1,000</p>
                <p className="mt-1 text-sm text-muted-foreground">USD • One-time payment</p>

                <div className="mt-6 space-y-2 text-left">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Included in service fee:</h4>
                  {["Profile review & eligibility assessment", "Document preparation guidance", "Application support & processing", "Step-by-step assistance", "Follow-up support until decision"].map((item) => (
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
                        Government fees, embassy fees, language test fees (IELTS/TOEFL), credential evaluation fees (WES/ECA), travel, health insurance, and other third-party costs are <strong>NOT included</strong> in our service fee and must be paid separately by the applicant.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ===== SECTION 6: LEAD FORM ===== */}
      <section id="apply-form" className="section-padding bg-navy-gradient scroll-mt-16">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-lg">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-primary-foreground md:text-3xl">Start Your Application</h2>
              <p className="mt-2 text-sm text-primary-foreground/60">Fill in your details and we'll guide you through the next steps</p>
            </div>

            <Card className="border-primary-foreground/10 bg-primary-foreground/5 shadow-2xl">
              <CardContent className="p-6 md:p-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label className="text-xs text-primary-foreground/70">Full Name *</Label>
                    <Input
                      value={name} onChange={(e) => setName(e.target.value)}
                      placeholder="Your full name"
                      className="mt-1 border-primary-foreground/10 bg-primary-foreground/5 text-primary-foreground placeholder:text-primary-foreground/30"
                      required maxLength={100}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-primary-foreground/70">Country *</Label>
                    <Select value={country} onValueChange={setCountry}>
                      <SelectTrigger className="mt-1 border-primary-foreground/10 bg-primary-foreground/5 text-primary-foreground">
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-primary-foreground/70">Phone Number *</Label>
                    <Input
                      value={phone} onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 234 567 8900"
                      className="mt-1 border-primary-foreground/10 bg-primary-foreground/5 text-primary-foreground placeholder:text-primary-foreground/30"
                      required maxLength={20}
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-primary-foreground/70">What interests you?</Label>
                    <Select value={interest} onValueChange={setInterest}>
                      <SelectTrigger className="mt-1 border-primary-foreground/10 bg-primary-foreground/5 text-primary-foreground">
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LMIA Program">LMIA Program</SelectItem>
                        <SelectItem value="Francophone Mobility">Francophone Mobility</SelectItem>
                        <SelectItem value="Express Entry">Express Entry</SelectItem>
                        <SelectItem value="Not sure">Not sure yet</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button type="submit" variant="heroGold" size="lg" className="w-full mt-2" disabled={!isValid || submitting}>
                    {submitting ? "Saving…" : <>Continue Application <ArrowRight className="ml-1 h-4 w-4" /></>}
                  </Button>

                  <p className="text-center text-[11px] text-primary-foreground/40">
                    Your data is private and secure. No payment required at this step.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ===== SECTION 7: TRUST + FAQ ===== */}
      <section className="section-padding">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-center text-2xl font-bold md:text-3xl">Frequently Asked Questions</h2>
            <div className="mt-8 space-y-3">
              {FAQS.map((faq) => (
                <Collapsible key={faq.q}>
                  <Card>
                    <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-left">
                      <span className="flex items-center gap-2 text-sm font-medium">
                        <HelpCircle className="h-4 w-4 shrink-0 text-primary" />
                        {faq.q}
                      </span>
                      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform data-[state=open]:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-4 pb-4 pl-10">
                        <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              ))}
            </div>

            {/* Disclaimer */}
            <Card className="mt-8 border-amber-200/60 bg-amber-50/30">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                  <p className="text-xs leading-relaxed text-amber-800">
                    <strong>Disclaimer:</strong> Global Link Migration Services provides professional visa application support. 
                    We do not guarantee visa approval. Final decisions are made solely by immigration authorities, embassies, and consulates. 
                    Our service fee covers our professional services only — government and third-party fees are separate.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ===== SECTION 8: FINAL CTA ===== */}
      <section className="section-padding bg-navy-gradient">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-primary-foreground md:text-3xl">
              Start Your Application Today
            </h2>
            <p className="mt-3 text-sm text-primary-foreground/60">
              Take the first step towards working in Canada with professional support.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <a href="#apply-form">
                <Button variant="heroGold" size="xl">
                  Start Application <ArrowRight className="ml-1 h-5 w-5" />
                </Button>
              </a>
              <Link to="/advisor">
                <Button variant="heroOutline" size="xl">
                  Book Consultation
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal footer */}
      <footer className="border-t bg-card py-6">
        <div className="container mx-auto px-4 text-center text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Global Link Migration Services. All rights reserved.</p>
          <p className="mt-1">Professional visa application support services.</p>
        </div>
      </footer>
    </div>
  );
}
