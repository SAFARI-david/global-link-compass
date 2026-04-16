import { createFileRoute } from "@tanstack/react-router";
import { GraduationCap, Briefcase, BookOpen } from "lucide-react";
import { VisaCategoryPage } from "@/components/VisaCategoryPage";

export const Route = createFileRoute("/services/uk-study-visa")({
  head: () => ({
    meta: [
      { title: "UK Study Visa Programs — Global Link Migration Services" },
      { name: "description", content: "Explore UK study visa pathways: Tier 4 Student Visa and Graduate Route. Compare programs and find your path to studying in the UK." },
      { property: "og:title", content: "UK Study Visa Programs — Global Link" },
      { property: "og:description", content: "Compare UK study visa programs and find the best pathway for your academic and career goals." },
    ],
  }),
  component: UKStudyVisaPage,
});

function UKStudyVisaPage() {
  return (
    <VisaCategoryPage
      config={{
        country: "United Kingdom",
        visaType: "Study Visa",
        applyRoute: "/apply/study",
        breadcrumbs: [
          { label: "Home", to: "/" },
          { label: "Services", to: "/services" },
          { label: "United Kingdom" },
          { label: "Study Visa" },
        ],
        title: "UK Study Visa Programs",
        subtitle: "Discover pathways to studying at world-renowned UK universities. Compare programs, understand requirements, and start your application with confidence.",
        introTitle: "Understand Your UK Study Visa Options",
        introText: "The United Kingdom is home to some of the world's most prestigious universities and offers international students excellent post-study work opportunities. Whether you're applying for your first degree or looking to stay after graduation, this page helps you compare your options.",
        fitCards: [
          { icon: GraduationCap, title: "Full-Time Student", description: "If you've been accepted to a UK university and need a visa to study full-time at degree level or above.", recommendation: "Tier 4 Student Visa", color: "gold" },
          { icon: Briefcase, title: "Recent UK Graduate", description: "If you've completed a UK degree and want to stay and work for up to 2–3 years without sponsorship.", recommendation: "Graduate Route Visa", color: "primary" },
        ],
        faqs: [
          { q: "Can I work while studying in the UK?", a: "Yes, Tier 4 visa holders can typically work up to 20 hours per week during term time and full-time during holidays." },
          { q: "What is the Graduate Route?", a: "The Graduate Route allows international students to stay in the UK for 2 years (3 years for PhD graduates) after completing their degree to work or look for work, without needing employer sponsorship." },
          { q: "Do I need IELTS for a UK study visa?", a: "Most UK institutions require IELTS 6.0+ overall for degree-level courses. Some institutions accept alternative English language tests." },
          { q: "Can I bring my family to the UK?", a: "Dependants may accompany students on courses of 9 months or longer at postgraduate level (RQF Level 7 or above)." },
          { q: "How long does visa processing take?", a: "Standard processing takes 3–8 weeks. Priority processing may be available in some countries for an additional fee." },
          { q: "Can I switch from student visa to work visa?", a: "Yes, you can switch to the Graduate Route after completing your degree, and then to a Skilled Worker visa if you find eligible employment." },
        ],
        documents: [
          "Valid Passport",
          "CAS (Confirmation of Acceptance for Studies)",
          "Proof of English Language Proficiency (IELTS or equivalent)",
          "Financial Evidence (bank statements)",
          "Academic Transcripts and Certificates",
          "Tuberculosis Test Results (if applicable)",
          "Passport-Sized Photographs",
        ],
        ctaTitle: "Ready to Start Your UK Study Visa Application?",
        ctaText: "Begin your application and we will help you choose the right UK study pathway and prepare a strong application.",
      }}
    />
  );
}
