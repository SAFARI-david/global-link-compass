import { createFileRoute } from "@tanstack/react-router";
import { Award, Briefcase, Star } from "lucide-react";
import { VisaCategoryPage } from "@/components/VisaCategoryPage";

export const Route = createFileRoute("/services/uae-work-visa")({
  head: () => ({
    meta: [
      { title: "UAE Work Visa Programs — Global Link Migration Services" },
      { name: "description", content: "Explore UAE work visa pathways including the prestigious Golden Visa. Secure long-term residency in the UAE." },
      { property: "og:title", content: "UAE Work Visa Programs — Global Link" },
      { property: "og:description", content: "Explore UAE work visa and residency programs. Learn about the Golden Visa and start your application." },
    ],
  }),
  component: UAEWorkVisaPage,
});

function UAEWorkVisaPage() {
  return (
    <VisaCategoryPage
      config={{
        country: "UAE",
        visaType: "Work Visa",
        applyRoute: "/apply/work-visa",
        breadcrumbs: [
          { label: "Home", to: "/" },
          { label: "Services", to: "/services" },
          { label: "UAE" },
          { label: "Work Visa" },
        ],
        title: "UAE Work Visa Programs",
        subtitle: "Explore pathways to living and working in the UAE — from the prestigious Golden Visa to employment-based residency in one of the world's most dynamic economies.",
        introTitle: "Understand Your UAE Work Visa Options",
        introText: "The UAE offers a tax-free environment, world-class infrastructure, and a strategic global location. The Golden Visa program provides long-term residency for investors, entrepreneurs, and skilled professionals without requiring a national sponsor.",
        fitCards: [
          { icon: Star, title: "Investor or Entrepreneur", description: "If you have significant investments, business ownership, or entrepreneurial credentials.", recommendation: "Golden Visa (Investor Category)", color: "gold" },
          { icon: Briefcase, title: "Specialized Professional", description: "If you work in a specialized field such as medicine, engineering, science, or technology.", recommendation: "Golden Visa (Professional Category)", color: "primary" },
          { icon: Award, title: "Outstanding Talent", description: "If you have exceptional achievements in arts, culture, sports, or academic research.", recommendation: "Golden Visa (Talent Category)", color: "green" },
        ],
        faqs: [
          { q: "Do I need a UAE employer to get a Golden Visa?", a: "Not necessarily. Self-employed professionals, investors, and entrepreneurs can apply without employer sponsorship." },
          { q: "Is the Golden Visa renewable?", a: "Yes, the Golden Visa is renewable as long as you continue to meet the eligibility criteria for your category." },
          { q: "Do I need to live in the UAE full-time?", a: "No, Golden Visa holders can stay outside the UAE for extended periods without losing their residency status." },
          { q: "Can my family join me?", a: "Yes, Golden Visa holders can sponsor their spouse, children, and in some cases domestic helpers." },
          { q: "What categories qualify for the Golden Visa?", a: "Categories include investors, entrepreneurs, specialized professionals (doctors, engineers, scientists, IT specialists), outstanding students, and humanitarian pioneers." },
          { q: "How long does the application take?", a: "Golden Visa applications are typically processed within 2–4 weeks once all documents are submitted." },
        ],
        documents: [
          "Valid Passport",
          "Emirates ID (if applicable)",
          "Professional Qualification Certificates",
          "Employment Contract or Business License",
          "CV / Resume",
          "Property Ownership Documents (for investors)",
          "Financial Statements (for investors/entrepreneurs)",
          "Medical Fitness Certificate",
        ],
        ctaTitle: "Ready to Start Your UAE Work Visa Application?",
        ctaText: "Submit your details and we will help assess the most suitable UAE residency pathway for your profile and goals.",
      }}
    />
  );
}
