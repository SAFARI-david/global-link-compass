import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/HeroSection";
import { ServicesSection } from "@/components/ServicesSection";
import { HowItWorks } from "@/components/HowItWorks";
import { TrustBlock } from "@/components/TrustBlock";
import { ServicesPreview } from "@/components/ServicesPreview";
import { JobsPreview } from "@/components/JobsPreview";
import { StudyPreview } from "@/components/StudyPreview";
import { AgentsSection } from "@/components/AgentsSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { FinalCTA } from "@/components/FinalCTA";
import { LeadCaptureForm } from "@/components/LeadCaptureForm";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Global Link Migration Services — Work Visas, Study Visas, Jobs & International Applications" },
      { name: "description", content: "Professional visa application support for work visas, study visas, and international opportunities. Trusted by applicants and agents worldwide." },
      { property: "og:title", content: "Global Link Migration Services — Trusted Immigration Platform" },
      { property: "og:description", content: "Professional visa application support for work visas, study visas, and international opportunities." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      {/* Mid-page lead capture */}
      <section className="section-padding bg-muted/30">
        <div className="container-narrow">
          <div className="mx-auto max-w-2xl">
            <LeadCaptureForm source="homepage-mid" />
          </div>
        </div>
      </section>
      <HowItWorks />
      <TrustBlock />
      <ServicesPreview />
      <JobsPreview />
      <StudyPreview />
      <AgentsSection />
      <TestimonialsSection />
      <FinalCTA />
    </>
  );
}
