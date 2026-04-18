import { createFileRoute, Link } from "@tanstack/react-router";
import { Shield, Users, Globe, Award, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Global Link Migration Services" },
      { name: "description", content: "Global Link Migration Services helps applicants and agents navigate work visas, study visas, and international opportunities with clarity and integrity." },
      { property: "og:title", content: "About Global Link Migration Services" },
      { property: "og:description", content: "A trusted platform supporting applicants and agents through structured, transparent visa application services." },
    ],
  }),
  component: AboutPage,
});

const values = [
  { icon: Shield, title: "Transparency", desc: "Clear pricing, clear process, no surprises. You always know what you're paying for and why." },
  { icon: Users, title: "Personal support", desc: "Real specialists guide every application. You get a dedicated point of contact, not a chatbot." },
  { icon: Globe, title: "Global coverage", desc: "Multi-country visa pathways across work, study, and visit programs." },
  { icon: Award, title: "Professional standards", desc: "Structured workflows, documented processes, and a focus on doing things properly." },
];

function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-navy-gradient text-primary-foreground py-16 lg:py-24">
        <div className="container-narrow text-center max-w-3xl mx-auto">
          <div className="gold-divider mx-auto mb-5" />
          <h1 className="text-3xl md:text-5xl font-extrabold font-heading tracking-tight">
            Helping people move <span className="text-gradient-gold">forward</span>
          </h1>
          <p className="mt-5 text-base md:text-lg opacity-80 leading-relaxed">
            Global Link Migration Services is a professional visa application support platform built for applicants, families, and licensed agents. We make immigration processes clearer, more structured, and more accessible.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="container-narrow py-12 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="gold-divider mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold font-heading">Our mission</h2>
            <p className="mt-4 text-foreground/80 leading-relaxed">
              Migration shouldn't feel like a maze. We believe every applicant deserves a clear pathway, honest guidance about what's realistic, and structured support from start to finish.
            </p>
            <p className="mt-3 text-foreground/80 leading-relaxed">
              That's why we built Global Link as a single platform combining work visa support, study visa support, a verified job board, and a dedicated agent portal — all underpinned by transparent service fees and a no-payment-until-you-proceed model.
            </p>
            <ul className="mt-6 space-y-2.5 text-sm">
              {[
                "Structured, document-verified application support",
                "Transparent service fees, separate from government costs",
                "Dedicated case officers — not bots",
                "Built for both individual applicants and agent partners",
              ].map((p) => (
                <li key={p} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-gold mt-0.5 shrink-0" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border bg-card p-8 shadow-sm">
            <h3 className="font-bold text-lg mb-4">Who we work with</h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-semibold">Individual applicants</p>
                <p className="text-muted-foreground mt-1">Workers, students, families, and visitors needing structured support to apply.</p>
              </div>
              <div>
                <p className="font-semibold">Licensed agents</p>
                <p className="text-muted-foreground mt-1">Immigration agents using our portal to manage and submit client applications at scale.</p>
              </div>
              <div>
                <p className="font-semibold">Employers</p>
                <p className="text-muted-foreground mt-1">Companies sponsoring international hires through our supported visa pathways.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-surface section-padding">
        <div className="container-narrow">
          <div className="text-center max-w-xl mx-auto">
            <div className="gold-divider mx-auto mb-4" />
            <h2 className="text-2xl md:text-3xl font-bold font-heading">What we stand for</h2>
            <p className="mt-3 text-muted-foreground">The principles behind every application we support.</p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="card-premium p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gold/10">
                  <v.icon className="h-5 w-5 text-gold" />
                </div>
                <h3 className="mt-4 text-base font-bold">{v.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-narrow py-12 lg:py-16">
        <div className="rounded-2xl bg-navy-gradient text-primary-foreground p-8 lg:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold font-heading">Ready to start your journey?</h2>
          <p className="mt-3 opacity-80 max-w-xl mx-auto">
            Explore our services or get in touch — we'll guide you to the right pathway.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/services"><Button variant="heroGold" size="lg">Explore services <ArrowRight className="ml-1 h-4 w-4" /></Button></Link>
            <Link to="/contact"><Button variant="heroOutline" size="lg">Contact us</Button></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
