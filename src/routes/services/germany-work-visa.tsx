import { createFileRoute } from "@tanstack/react-router";
import { Briefcase, BookOpen } from "lucide-react";
import { VisaCategoryPage } from "@/components/VisaCategoryPage";

export const Route = createFileRoute("/services/germany-work-visa")({
  head: () => ({
    meta: [
      { title: "Germany Work Visa Programs — Global Link Migration Services" },
      { name: "description", content: "Explore Germany work visa pathways. Learn about the Job Seeker Visa and start your journey to Europe's largest economy." },
      { property: "og:title", content: "Germany Work Visa Programs — Global Link" },
      { property: "og:description", content: "Explore Germany work visa pathways and find the right program for your career goals." },
    ],
  }),
  component: GermanyWorkVisaPage,
});

function GermanyWorkVisaPage() {
  return (
    <VisaCategoryPage
      config={{
        country: "Germany",
        visaType: "Work Visa",
        applyRoute: "/apply/work-visa",
        breadcrumbs: [
          { label: "Home", to: "/" },
          { label: "Services", to: "/services" },
          { label: "Germany" },
          { label: "Work Visa" },
        ],
        title: "Germany Work Visa Programs",
        subtitle: "Explore pathways to working in Europe's largest economy. Germany actively seeks skilled professionals across technology, engineering, healthcare, and more.",
        introTitle: "Understand Your Germany Work Visa Options",
        introText: "Germany is one of Europe's most attractive destinations for skilled professionals, offering strong job markets, competitive salaries, and excellent quality of life. The Job Seeker Visa allows qualified professionals to enter Germany and search for employment on-site.",
        fitCards: [
          { icon: BookOpen, title: "Exploring Opportunities", description: "If you have a recognized degree and want to travel to Germany to search for a job in person for up to 6 months.", recommendation: "Job Seeker Visa", color: "gold" },
        ],
        faqs: [
          { q: "Can I work on a Job Seeker Visa?", a: "No, the Job Seeker Visa does not permit employment. You can only begin working after converting to a work residence permit once you find a job." },
          { q: "What if I don't find a job in 6 months?", a: "You must leave Germany before the visa expires. However, you may reapply in the future." },
          { q: "Do I need to speak German?", a: "German language skills are beneficial but not always mandatory. English may suffice for IT and international roles, though German is expected in most other industries." },
          { q: "What is a blocked account?", a: "A blocked account (Sperrkonto) is a special bank account where you deposit approximately €11,208 to prove you can financially support yourself during your stay in Germany." },
          { q: "Is my degree recognized in Germany?", a: "Your degree must be recognized in Germany. You can check through the anabin database. If your degree is not directly recognized, you may need to go through a credential evaluation process." },
          { q: "Can I bring my family?", a: "Family reunification is not typically possible on a Job Seeker Visa, but may be arranged once you obtain a work residence permit." },
        ],
        documents: [
          "Valid Passport",
          "University Degree Certificate with Recognition",
          "Proof of Financial Means (Blocked Account)",
          "Health Insurance Coverage",
          "Detailed CV in German or English",
          "Motivation Letter",
          "Biometric Photographs",
          "Proof of Accommodation in Germany",
        ],
        ctaTitle: "Ready to Start Your Germany Work Visa Application?",
        ctaText: "Begin your application and we will help assess your eligibility and guide you through the Germany Job Seeker Visa process.",
      }}
    />
  );
}
