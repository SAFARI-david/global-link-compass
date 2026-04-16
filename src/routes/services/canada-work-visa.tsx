import { createFileRoute } from "@tanstack/react-router";
import { Briefcase, Globe, Award } from "lucide-react";
import { VisaCategoryPage } from "@/components/VisaCategoryPage";

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

function CanadaWorkVisaPage() {
  return (
    <VisaCategoryPage
      config={{
        country: "Canada",
        visaType: "Work Visa",
        applyRoute: "/apply/work-visa",
        breadcrumbs: [
          { label: "Home", to: "/" },
          { label: "Services", to: "/services" },
          { label: "Canada" },
          { label: "Work Visa" },
        ],
        title: "Canada Work Visa Programs",
        subtitle: "Explore available Canada work visa pathways and find the program that best matches your profile, language ability, and career goals.",
        introTitle: "Understand Your Canada Work Visa Options",
        introText: "Canada offers different work visa pathways depending on job offer status, language profile, qualifications, and long-term immigration goals. This page helps you compare major options and choose the most suitable path.",
        fitCards: [
          { icon: Briefcase, title: "Employer-Supported Work", description: "If you have a job offer from a Canadian employer and want structured work authorization.", recommendation: "LMIA Program", color: "gold" },
          { icon: Globe, title: "French-Speaking Professional", description: "If you speak French and want a faster, LMIA-exempt route to working in Canada.", recommendation: "Francophone Mobility", color: "primary" },
          { icon: Award, title: "Long-Term Immigration", description: "If you are aiming for permanent residence through a merit-based points system.", recommendation: "Express Entry", color: "green" },
        ],
        faqs: [
          { q: "Do I need a job offer to work in Canada?", a: "It depends on the program. The LMIA and Francophone Mobility programs require a job offer. Express Entry does not require one, though it can boost your score." },
          { q: "Which program is fastest?", a: "The Francophone Mobility Program is typically the fastest as it is LMIA-exempt. Express Entry processing for permanent residence takes 6-8 months after receiving an Invitation to Apply." },
          { q: "Can my family come with me?", a: "Yes, most Canada work visa programs allow you to include your spouse/partner and dependent children. Spouses may be eligible for open work permits." },
          { q: "Do I need to speak French?", a: "Only the Francophone Mobility Program requires French proficiency. For LMIA and Express Entry, English or French proficiency is accepted." },
          { q: "What is the Comprehensive Ranking System (CRS)?", a: "CRS is a points-based system used in Express Entry to rank candidates based on age, education, language ability, work experience, and other factors." },
          { q: "How much does it cost?", a: "Service fees vary by program. Government processing fees, medical exams, and credential assessments are additional costs not included in our service fee." },
        ],
        documents: [
          "Valid Passport", "CV / Resume", "Academic Certificates", "Work Experience Documents",
          "Language Test Results (if applicable)", "Police Clearance Certificate",
          "Additional supporting documents depending on program",
        ],
        ctaTitle: "Ready to Start Your Canada Work Visa Application?",
        ctaText: "Submit your details and we will help assess the most suitable Canada work visa pathway for your profile.",
      }}
    />
  );
}
