import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Globe, Briefcase, Clock, DollarSign, Users, CheckCircle, XCircle,
  FileText, Shield, ArrowRight, ChevronDown, ChevronUp, MapPin, Award,
  Star, BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { EligibilityCheck } from "@/components/EligibilityCheck";

export const Route = createFileRoute("/services/$slug")({
  head: () => ({
    meta: [
      { title: "Program Details — Global Link Migration Services" },
    ],
  }),
  component: ProgramDetailPage,
});

function ProgramDetailPage() {
  const { slug } = Route.useParams();
  const [program, setProgram] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [eligibilityOpen, setEligibilityOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    supabase
      .from("programs")
      .select("*")
      .eq("slug", slug)
      .eq("status", "active")
      .single()
      .then(({ data }) => {
        setProgram(data);
        setLoading(false);
      });
  }, [slug]);

  if (!mounted || loading) return <div className="flex min-h-screen items-center justify-center"><p className="text-muted-foreground">Loading program...</p></div>;
  if (!program) return <div className="flex min-h-screen flex-col items-center justify-center gap-4"><h1 className="text-2xl font-bold">Program Not Found</h1><Link to="/"><Button>Back to Home</Button></Link></div>;

  const docs: { name: string; required: boolean }[] = program.required_documents || [];
  const steps: { title: string; description: string; order: number }[] = program.process_steps || [];
  const benefits: string[] = program.benefits || [];
  const faqs: { question: string; answer: string }[] = program.faqs || [];
  const included: string[] = program.whats_included || [];
  const notIncluded: string[] = program.whats_not_included || [];

  return (
    <div>
      {/* Hero */}
      <section className="bg-navy-gradient text-primary-foreground py-16 lg:py-24">
        <div className="container-narrow">
          <div className="flex flex-wrap items-center gap-2 mb-4 text-sm opacity-80">
            <Link to="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span>{program.country}</span>
            <span>/</span>
            <span>{program.visa_type}</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-gold/20 text-gold border-gold/30">{program.country}</Badge>
            <Badge className="bg-primary-foreground/10 border-primary-foreground/20">{program.visa_type}</Badge>
            {program.category && <Badge variant="outline" className="border-primary-foreground/20 text-primary-foreground/80">{program.category}</Badge>}
          </div>
          <h1 className="text-3xl font-bold tracking-tight lg:text-5xl mb-4 font-heading">{program.name}</h1>
          {program.tagline && <p className="text-lg opacity-80 max-w-2xl mb-8">{program.tagline}</p>}
          <div className="flex flex-wrap gap-3">
            <Link to="/apply/work-visa">
              <Button variant="heroGold" size="lg">
                {program.cta_apply_text || "Start Your Application"} <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="heroOutline" size="lg" onClick={() => setEligibilityOpen(true)}>
              Check Your Eligibility
            </Button>
          </div>
        </div>
      </section>

      {/* Quick Summary Strip */}
      <section className="border-b bg-card">
        <div className="container-narrow py-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            <div className="flex items-center gap-2"><MapPin className="h-4 w-4 text-gold" /><div><p className="text-xs text-muted-foreground">Destination</p><p className="text-sm font-medium">{program.country}</p></div></div>
            <div className="flex items-center gap-2"><Briefcase className="h-4 w-4 text-gold" /><div><p className="text-xs text-muted-foreground">Visa Type</p><p className="text-sm font-medium">{program.visa_type}</p></div></div>
            {program.category && <div className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-gold" /><div><p className="text-xs text-muted-foreground">Category</p><p className="text-sm font-medium">{program.category}</p></div></div>}
            {program.processing_time && <div className="flex items-center gap-2"><Clock className="h-4 w-4 text-gold" /><div><p className="text-xs text-muted-foreground">Processing</p><p className="text-sm font-medium">{program.processing_time}</p></div></div>}
            {program.service_fee && <div className="flex items-center gap-2"><DollarSign className="h-4 w-4 text-gold" /><div><p className="text-xs text-muted-foreground">Service Fee</p><p className="text-sm font-medium">{program.currency} {program.service_fee.toLocaleString()}</p></div></div>}
            {program.family_dependant_option && <div className="flex items-center gap-2"><Users className="h-4 w-4 text-gold" /><div><p className="text-xs text-muted-foreground">Family</p><p className="text-sm font-medium">Options Available</p></div></div>}
          </div>
        </div>
      </section>

      <div className="container-narrow py-12 lg:py-16 space-y-16">
        {/* Overview */}
        {(program.short_overview || program.full_description) && (
          <section>
            <h2 className="text-2xl font-bold mb-4 font-heading">Program Overview</h2>
            {program.short_overview && <p className="text-lg text-muted-foreground mb-4">{program.short_overview}</p>}
            {program.full_description && <p className="leading-relaxed text-foreground/80">{program.full_description}</p>}
            {program.why_choose && (
              <div className="mt-6 rounded-lg border-l-4 border-gold bg-gold/5 p-6">
                <h3 className="font-semibold mb-2">Why Choose This Program</h3>
                <p className="text-foreground/80">{program.why_choose}</p>
              </div>
            )}
          </section>
        )}

        {/* Who Can Apply */}
        {program.eligibility_summary && (
          <section>
            <h2 className="text-2xl font-bold mb-6 font-heading">Who Can Apply</h2>
            <p className="text-foreground/80 mb-6">{program.eligibility_summary}</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {program.education_requirement && (
                <Card><CardContent className="p-5"><div className="flex gap-3"><Award className="h-5 w-5 text-gold mt-0.5" /><div><h4 className="font-semibold mb-1">Education</h4><p className="text-sm text-muted-foreground">{program.education_requirement}</p></div></div></CardContent></Card>
              )}
              {program.work_experience_requirement && (
                <Card><CardContent className="p-5"><div className="flex gap-3"><Briefcase className="h-5 w-5 text-gold mt-0.5" /><div><h4 className="font-semibold mb-1">Work Experience</h4><p className="text-sm text-muted-foreground">{program.work_experience_requirement}</p></div></div></CardContent></Card>
              )}
              {program.language_requirement && (
                <Card><CardContent className="p-5"><div className="flex gap-3"><Globe className="h-5 w-5 text-gold mt-0.5" /><div><h4 className="font-semibold mb-1">Language</h4><p className="text-sm text-muted-foreground">{program.language_requirement}</p></div></div></CardContent></Card>
              )}
              {program.other_conditions && (
                <Card><CardContent className="p-5"><div className="flex gap-3"><FileText className="h-5 w-5 text-gold mt-0.5" /><div><h4 className="font-semibold mb-1">Other Conditions</h4><p className="text-sm text-muted-foreground">{program.other_conditions}</p></div></div></CardContent></Card>
              )}
            </div>
          </section>
        )}

        {/* Required Documents */}
        {docs.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 font-heading">Required Documents</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {docs.map((doc, i) => (
                <div key={i} className="flex items-center gap-3 rounded-lg border p-4">
                  <FileText className="h-5 w-5 text-gold" />
                  <span className="flex-1 text-sm font-medium">{doc.name}</span>
                  {doc.required ? (
                    <Badge variant="default" className="text-xs">Required</Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">If applicable</Badge>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Application Process — Visual Timeline */}
        {steps.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-8 font-heading">Application Process</h2>
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border lg:left-1/2 lg:-translate-x-px" />
              {steps.sort((a, b) => a.order - b.order).map((step, i) => (
                <div key={i} className={`relative mb-8 flex items-start gap-6 ${i % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"}`}>
                  <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold text-gold-foreground font-bold text-lg shadow-lg lg:absolute lg:left-1/2 lg:-translate-x-1/2">
                    {step.order}
                  </div>
                  <Card className={`flex-1 ${i % 2 === 0 ? "lg:mr-[calc(50%+2rem)]" : "lg:ml-[calc(50%+2rem)]"}`}>
                    <CardContent className="p-5">
                      <h3 className="font-semibold mb-1">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* What's Included / Not Included */}
        {(included.length > 0 || notIncluded.length > 0) && (
          <section>
            <div className="grid gap-6 md:grid-cols-2">
              {included.length > 0 && (
                <Card className="border-green-200 bg-green-50/30">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><CheckCircle className="h-5 w-5 text-green-600" />What Our Service Includes</h3>
                    <ul className="space-y-2">
                      {included.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm"><CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />{item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
              {notIncluded.length > 0 && (
                <Card className="border-muted">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2"><XCircle className="h-5 w-5 text-muted-foreground" />What Is Not Included</h3>
                    <ul className="space-y-2">
                      {notIncluded.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground"><XCircle className="h-4 w-4 mt-0.5 shrink-0" />{item}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>
        )}

        {/* Benefits */}
        {benefits.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 font-heading">Program Highlights</h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border p-4">
                  <Star className="h-5 w-5 text-gold mt-0.5 shrink-0" />
                  <span className="text-sm">{b}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* FAQs */}
        {faqs.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 font-heading">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="rounded-lg border">
                  <button className="flex w-full items-center justify-between p-5 text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span className="font-medium pr-4">{faq.question}</span>
                    {openFaq === i ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
                  </button>
                  {openFaq === i && <div className="border-t px-5 py-4 text-sm text-muted-foreground">{faq.answer}</div>}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Compliance */}
        <section className="rounded-lg border bg-muted/30 p-6">
          <div className="flex gap-3">
            <Shield className="h-5 w-5 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold mb-1">Compliance Disclaimer</h3>
              <p className="text-sm text-muted-foreground">We provide professional application support and guidance services. Final decisions on visa approvals, work permits, and immigration status are made by government authorities, embassies, and consulates. We do not guarantee any specific outcome.</p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="rounded-2xl bg-navy-gradient text-primary-foreground p-8 lg:p-12 text-center">
          <h2 className="text-2xl font-bold mb-3 font-heading">Ready to Start Your Application?</h2>
          <p className="opacity-80 mb-6 max-w-xl mx-auto">Begin your application and we will help assess your eligibility and guide you through the {program.name} application process.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/apply/work-visa">
              <Button variant="heroGold" size="lg">
                {program.cta_apply_text || "Start Your Application"} <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Button variant="heroOutline" size="lg" onClick={() => setEligibilityOpen(true)}>
              Check Your Eligibility
            </Button>
          </div>
          <p className="mt-4 text-xs opacity-50">No payment required at this stage. Service fees are separate from government costs.</p>
        </section>
      </div>
      <EligibilityCheck open={eligibilityOpen} onOpenChange={setEligibilityOpen} />
    </div>
  );
}
