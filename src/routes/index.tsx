import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/HeroSection";
import { SocialProofBar } from "@/components/SocialProofBar";
import { ServicesSection } from "@/components/ServicesSection";
import { HowItWorks } from "@/components/HowItWorks";
import { TrustBlock } from "@/components/TrustBlock";
import { ServicesPreview } from "@/components/ServicesPreview";
import { JobsPreview } from "@/components/JobsPreview";
import { StudyPreview } from "@/components/StudyPreview";
import { AgentsSection } from "@/components/AgentsSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { FinalCTA } from "@/components/FinalCTA";
import { PricingSection } from "@/components/PricingSection";
import { SectionCTA } from "@/components/SectionCTA";

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
      <SocialProofBar context="general" />
      <ServicesSection />
      <SectionCTA
        variant="compact"
        title="Ready to start?"
        subtitle="Pick a service above or check your eligibility in 2 minutes."
      />
      <HowItWorks />
      <TrustBlock />
      <ServicesPreview />
      <SectionCTA
        variant="compact"
        title="Find your visa pathway"
        subtitle="Get matched with the right program for your goals."
      />
      <JobsPreview />
      <StudyPreview />
      <PricingSection />
      <AgentsSection />
      <TestimonialsSection />
      <SectionCTA
        variant="navy"
        title="Your visa journey starts with one step"
        subtitle="Start your application today. We'll review your eligibility, give you a clear plan, and only collect our service fee once you choose to proceed."
      />
      <FinalCTA />
    </>
  );
}
