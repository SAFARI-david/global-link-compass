import { createFileRoute } from "@tanstack/react-router";
import { Briefcase, GraduationCap, Award } from "lucide-react";
import { VisaCategoryPage } from "@/components/VisaCategoryPage";

export const Route = createFileRoute("/services/uk-work-visa")({
  head: () => ({
    meta: [
      { title: "UK Work Visa Programs — Global Link Migration Services" },
      { name: "description", content: "Explore UK work visa pathways including the Graduate Route Visa. Compare programs and find the right path to working in the United Kingdom." },
      { property: "og:title", content: "UK Work Visa Programs — Global Link" },
      { property: "og:description", content: "Compare UK work visa programs and find the best pathway for your career goals in the United Kingdom." },
    ],
  }),
  component: UKWorkVisaPage,
});

function UKWorkVisaPage() {
  return (
    <VisaCategoryPage
      config={{
        country: "United Kingdom",
        visaType: "Work Visa",
        applyRoute: "/apply/work-visa",
        breadcrumbs: [
          { label: "Home", to: "/" },
          { label: "Services", to: "/services" },
          { label: "United Kingdom" },
          { label: "Work Visa" },
        ],
        title: "UK Work Visa Programs",
        subtitle: "Explore pathways to working in the United Kingdom — from post-study work opportunities to employer-sponsored skilled worker routes.",
        introTitle: "Understand Your UK Work Visa Options",
        introText: "The United Kingdom offers several routes for international professionals to live and work. Whether you've recently graduated from a UK university or are looking to build a long-term career, there are structured visa pathways designed for skilled talent.",
        fitCards: [
          { icon: GraduationCap, title: "Recent UK Graduate", description: "If you've completed a UK degree and want to stay and work for up to 2–3 years without employer sponsorship.", recommendation: "Graduate Route Visa", color: "gold" },
          { icon: Briefcase, title: "Skilled Professional", description: "If you have a job offer from a UK employer in an eligible skilled occupation.", recommendation: "Skilled Worker Visa (coming soon)", color: "primary" },
          { icon: Award, title: "Global Talent", description: "If you are a recognized leader or emerging talent in academia, research, arts, or digital technology.", recommendation: "Global Talent Visa (coming soon)", color: "green" },
        ],
        faqs: [
          { q: "Do I need a job offer to work in the UK?", a: "It depends on the visa. The Graduate Route does not require a job offer or sponsorship. The Skilled Worker visa requires a job offer from a licensed sponsor." },
          { q: "What is the Graduate Route?", a: "The Graduate Route allows international students who completed a UK degree to stay and work for 2 years (3 years for PhD graduates) without employer sponsorship." },
          { q: "Can I switch from the Graduate Route to a Skilled Worker visa?", a: "Yes, you can switch to a Skilled Worker visa from the Graduate Route if you find eligible employment with a licensed sponsor." },
          { q: "Can I bring my family?", a: "Dependants who were included on your Student visa can apply for the Graduate Route. Skilled Worker visa holders can also bring eligible dependants." },
          { q: "How long can I stay in the UK on a work visa?", a: "The Graduate Route lasts 2–3 years and cannot be extended. The Skilled Worker visa can be extended and may lead to settlement (indefinite leave to remain) after 5 years." },
          { q: "What are the English language requirements?", a: "The Graduate Route does not require a separate English test. The Skilled Worker visa requires proof of English at B1 level or above." },
        ],
        documents: [
          "Valid Passport",
          "Biometric Residence Permit (if applicable)",
          "Degree Completion Confirmation",
          "Certificate of Sponsorship (for Skilled Worker)",
          "Proof of English Language Proficiency",
          "Financial Evidence",
          "Criminal Record Certificate",
          "Passport-Sized Photographs",
        ],
        ctaTitle: "Ready to Start Your UK Work Visa Application?",
        ctaText: "Submit your details and we will help assess the most suitable UK work visa pathway for your profile and career goals.",
      }}
    />
  );
}
