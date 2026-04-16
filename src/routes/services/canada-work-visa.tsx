import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Globe, Briefcase, Clock, DollarSign, CheckCircle, Shield,
  ArrowRight, ChevronDown, ChevronUp, FileText, Users, Award,
  Star, MapPin, BookOpen, Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/services/canada-work-visa")({
  head: () => ({
    meta: [
      { title: "Canada Work Visa Programs — Global Link Migration Services" },
      { name: "description", content: "Explore Canada work visa pathways: LMIA, Francophone Mobility, Express Entry. Compare programs and find the best fit." },
      { property: "og:title", content: "Canada Work Visa Programs — Global Link" },
      { property: "og:description", content: "Explore Canada work visa pathways and find the program that best matches your profile." },
    ],
  }),
  component: CanadaWorkVisaPage,
});

type Program = {
  id: string;
  name: string;
  slug: string;
  category: string | null;
  tagline: string | null;
  best_for: string | null;
  processing_time: string | null;
  service_fee: number | null;
  currency: string | null;
  language_requirement: string | null;
  featured: boolean;
  short_overview: string | null;
};

function CanadaWorkVisaPage() {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    supabase
      .from("programs")
      .select("id, name, slug, category, tagline, best_for, processing_time, service_fee, currency, language_requirement, featured, short_overview")
      .eq("country", "Canada")
      .eq("visa_type", "Work Visa")
      .eq("status", "active")
      .order("featured", { ascending: false })
      .order("name")
      .then(({ data }) => {
        setPrograms(data || []);
        setLoading(false);
      });
  }, []);

  const faqs = [
    { q: "Do I need a job offer to work in Canada?", a: "It depends on the program. The LMIA and Francophone Mobility programs require a job offer. Express Entry does not require one, though it can boost your score." },
    { q: "Which program is fastest?", a: "The Francophone Mobility Program is typically the fastest as it is LMIA-exempt. Express Entry processing for permanent residence takes 6-8 months after receiving an Invitation to Apply." },
    { q: "Can my family come with me?", a: "Yes, most Canada work visa programs allow you to include your spouse/partner and dependent children. Spouses may be eligible for open work permits." },
    { q: "Do I need to speak French?", a: "Only the Francophone Mobility Program requires French proficiency. For LMIA and Express Entry, English or French proficiency is accepted." },
    { q: "What is the Comprehensive Ranking System (CRS)?", a: "CRS is a points-based system used in Express Entry to rank candidates based on age, education, language ability, work experience, and other factors." },
    { q: "How much does it cost?", a: "Service fees vary by program. Government processing fees, medical exams, and credential assessments are additional costs not included in our service fee." },
  ];

  const processSteps = [
    { title: "Profile Review", desc: "We review your qualifications, goals, and documents to assess your eligibility." },
    { title: "Program Assessment", desc: "We identify the most suitable program based on your profile and circumstances." },
    { title: "Document Preparation", desc: "We guide you through compiling, verifying, and organizing all required documents." },
    { title: "Application Guidance", desc: "Your application is prepared with complete supporting documentation." },
    { title: "Follow-Up Support", desc: "We monitor progress and provide updates through the processing period." },
  ];

  const documents = [
    "Valid Passport", "CV / Resume", "Academic Certificates", "Work Experience Documents",
    "Language Test Results (if applicable)", "Police Clearance Certificate",
    "Additional supporting documents depending on program",
  ];

  return (
    <div>
      {/* 1. Hero */}
      <section className="bg-navy-gradient text-primary-foreground py-16 lg:py-24">
        <div className="container-narrow">
          <div className="flex flex-wrap items-center gap-2 mb-4 text-sm opacity-80">
            <Link to="/" className="hover:underline">Home</Link><span>/</span>
            <Link to="/services" className="hover:underline">Services</Link><span>/</span>
            <span>Canada</span><span>/</span><span>Work Visa</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight lg:text-5xl mb-4 font-heading">Canada Work Visa Programs</h1>
          <p className="text-lg opacity-80 max-w-2xl mb-8">
            Explore available Canada work visa pathways and find the program that best matches your profile, language ability, and career goals.
          </p>
          <div className="flex flex-wrap gap-3 mb-6">
            <Link to="/apply/work-visa"><Button variant="heroGold" size="lg">Start Work Visa Application</Button></Link>
            <Button variant="heroOutline" size="lg">Book Consultation</Button>
          </div>
          <div className="flex flex-wrap gap-4 text-sm opacity-70">
            <span className="flex items-center gap-1.5"><Shield className="h-4 w-4" />Structured application support</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="h-4 w-4" />Clear eligibility guidance</span>
            <span className="flex items-center gap-1.5"><Award className="h-4 w-4" />Professional process support</span>
          </div>
        </div>
      </section>

      <div className="container-narrow py-12 lg:py-16 space-y-16">
        {/* 2. Intro */}
        <section>
          <h2 className="text-2xl font-bold mb-4 font-heading">Understand Your Canada Work Visa Options</h2>
          <p className="text-foreground/80 leading-relaxed max-w-3xl">
            Canada offers different work visa pathways depending on job offer status, language profile, qualifications, and long-term immigration goals.
            This page helps you compare major options and choose the most suitable path.
          </p>
        </section>

        {/* 3. Program Cards */}
        <section>
          <h2 className="text-2xl font-bold mb-6 font-heading">Featured Programs</h2>
          {loading ? (
            <p className="text-muted-foreground">Loading programs...</p>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {programs.map((p) => (
                <Card key={p.id} className="flex flex-col transition-shadow hover:shadow-lg">
                  <CardContent className="p-6 flex flex-col flex-1">
                    {p.featured && <Badge className="w-fit mb-2 bg-gold/10 text-gold border-gold/20 text-xs">★ Featured</Badge>}
                    {p.category && <Badge variant="secondary" className="w-fit mb-2 text-xs">{p.category}</Badge>}
                    <h3 className="text-lg font-semibold mb-2">{p.name}</h3>
                    {p.short_overview && <p className="text-sm text-muted-foreground mb-3 flex-1 line-clamp-3">{p.short_overview}</p>}
                    {p.best_for && <p className="text-xs text-muted-foreground mb-3"><span className="font-medium">Best for:</span> {p.best_for}</p>}
                    <div className="flex flex-wrap gap-2 text-xs text-muted-foreground mb-4">
                      {p.processing_time && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{p.processing_time}</span>}
                      {p.language_requirement && <span className="flex items-center gap-1"><Globe className="h-3 w-3" />{p.language_requirement.substring(0, 40)}</span>}
                    </div>
                    <div className="flex gap-2 mt-auto">
                      <Link to="/services/$slug" params={{ slug: p.slug }} className="flex-1">
                        <Button variant="outline" className="w-full" size="sm">View Program</Button>
                      </Link>
                      <Link to="/apply/work-visa" className="flex-1">
                        <Button variant="gold" className="w-full" size="sm">Apply Now</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        {/* 4. Comparison Table */}
        {programs.length >= 2 && (
          <section>
            <h2 className="text-2xl font-bold mb-6 font-heading">Program Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-muted/50 text-left">
                    <th className="p-4 font-medium">Program</th>
                    <th className="p-4 font-medium">Best For</th>
                    <th className="p-4 font-medium hidden sm:table-cell">Processing</th>
                    <th className="p-4 font-medium hidden md:table-cell">Fee</th>
                    <th className="p-4 font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {programs.map((p) => (
                    <tr key={p.id} className="border-t">
                      <td className="p-4 font-medium">{p.name}</td>
                      <td className="p-4 text-muted-foreground">{p.best_for || "—"}</td>
                      <td className="p-4 text-muted-foreground hidden sm:table-cell">{p.processing_time || "—"}</td>
                      <td className="p-4 text-muted-foreground hidden md:table-cell">{p.service_fee ? `${p.currency} ${p.service_fee.toLocaleString()}` : "—"}</td>
                      <td className="p-4">
                        <Link to="/services/$slug" params={{ slug: p.slug }}>
                          <Button variant="outline" size="sm">View <ArrowRight className="ml-1 h-3 w-3" /></Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* 5. Which Program Fits You */}
        <section>
          <h2 className="text-2xl font-bold mb-6 font-heading">Which Program Fits You?</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-gold/20 bg-gold/5">
              <CardContent className="p-6">
                <Briefcase className="h-8 w-8 text-gold mb-3" />
                <h3 className="font-semibold mb-2">Employer-Supported Work</h3>
                <p className="text-sm text-muted-foreground mb-4">If you have a job offer from a Canadian employer and want structured work authorization.</p>
                <p className="text-sm font-medium text-gold">→ LMIA Program</p>
              </CardContent>
            </Card>
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <Globe className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-semibold mb-2">French-Speaking Professional</h3>
                <p className="text-sm text-muted-foreground mb-4">If you speak French and want a faster, LMIA-exempt route to working in Canada.</p>
                <p className="text-sm font-medium text-primary">→ Francophone Mobility</p>
              </CardContent>
            </Card>
            <Card className="border-green-600/20 bg-green-50/30">
              <CardContent className="p-6">
                <Award className="h-8 w-8 text-green-600 mb-3" />
                <h3 className="font-semibold mb-2">Long-Term Immigration</h3>
                <p className="text-sm text-muted-foreground mb-4">If you are aiming for permanent residence through a merit-based points system.</p>
                <p className="text-sm font-medium text-green-600">→ Express Entry</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* 6. Process */}
        <section>
          <h2 className="text-2xl font-bold mb-8 font-heading">Our Process</h2>
          <div className="grid gap-6 md:grid-cols-5">
            {processSteps.map((step, i) => (
              <div key={i} className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gold text-gold-foreground font-bold text-lg">{i + 1}</div>
                <h3 className="font-semibold mb-1 text-sm">{step.title}</h3>
                <p className="text-xs text-muted-foreground">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Documents */}
        <section>
          <h2 className="text-2xl font-bold mb-6 font-heading">Common Documents</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {documents.map((doc, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border p-4">
                <FileText className="h-5 w-5 text-gold shrink-0" />
                <span className="text-sm">{doc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 8. Why Choose Us */}
        <section>
          <h2 className="text-2xl font-bold mb-6 font-heading">Why Choose Our Support</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: Shield, title: "Clear Process Guidance", desc: "Step-by-step support through every stage of your application" },
              { icon: Sparkles, title: "Program-Focused Support", desc: "Tailored guidance specific to your chosen visa pathway" },
              { icon: FileText, title: "Document Preparation", desc: "Comprehensive document verification and organization" },
              { icon: Users, title: "Structured Follow-Up", desc: "Proactive monitoring and regular status updates" },
            ].map((item, i) => (
              <Card key={i}>
                <CardContent className="p-6 text-center">
                  <item.icon className="h-8 w-8 text-gold mx-auto mb-3" />
                  <h3 className="font-semibold mb-2 text-sm">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* 9. FAQs */}
        <section>
          <h2 className="text-2xl font-bold mb-6 font-heading">Canada Work Visa FAQs</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="rounded-lg border">
                <button className="flex w-full items-center justify-between p-5 text-left" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="font-medium pr-4">{faq.q}</span>
                  {openFaq === i ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
                </button>
                {openFaq === i && <div className="border-t px-5 py-4 text-sm text-muted-foreground">{faq.a}</div>}
              </div>
            ))}
          </div>
        </section>

        {/* 10. Final CTA */}
        <section className="rounded-2xl bg-navy-gradient text-primary-foreground p-8 lg:p-12 text-center">
          <h2 className="text-2xl font-bold mb-3 font-heading">Ready to Start Your Canada Work Visa Application?</h2>
          <p className="opacity-80 mb-6 max-w-xl mx-auto">
            Submit your details and we will help assess the most suitable Canada work visa pathway for your profile.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/apply/work-visa"><Button variant="heroGold" size="lg">Start Application</Button></Link>
            <Button variant="heroOutline" size="lg">Book Consultation</Button>
          </div>
          <p className="mt-4 text-xs opacity-50">No payment required. Free initial assessment.</p>
        </section>
      </div>
    </div>
  );
}
