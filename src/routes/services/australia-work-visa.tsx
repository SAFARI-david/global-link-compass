import { createFileRoute } from "@tanstack/react-router";
import { Briefcase, Award, Users } from "lucide-react";
import { VisaCategoryPage } from "@/components/VisaCategoryPage";

export const Route = createFileRoute("/services/australia-work-visa")({
  head: () => ({
    meta: [
      { title: "Australia Work Visa Programs — Global Link Migration Services" },
      { name: "description", content: "Explore Australia work visa pathways: TSS Visa 482 and Skilled Independent Visa 189. Compare employer-sponsored and independent routes." },
      { property: "og:title", content: "Australia Work Visa Programs — Global Link" },
      { property: "og:description", content: "Compare Australia work visa programs and find the best pathway for your skills and career goals." },
    ],
  }),
  component: AustraliaWorkVisaPage,
});

function AustraliaWorkVisaPage() {
  return (
    <VisaCategoryPage
      config={{
        country: "Australia",
        visaType: "Work Visa",
        applyRoute: "/apply/work-visa",
        breadcrumbs: [
          { label: "Home", to: "/" },
          { label: "Services", to: "/services" },
          { label: "Australia" },
          { label: "Work Visa" },
        ],
        title: "Australia Work Visa Programs",
        subtitle: "Explore Australia's skilled migration pathways — from employer-sponsored temporary work to points-based permanent residency. Find the program that matches your profile.",
        introTitle: "Understand Your Australia Work Visa Options",
        introText: "Australia offers multiple work visa pathways for skilled professionals. Whether you have an employer sponsor or want to apply independently based on your qualifications, there is a structured pathway for you. This page helps you compare options and make an informed decision.",
        fitCards: [
          { icon: Briefcase, title: "Have an Employer Sponsor", description: "If you have a job offer from an Australian employer in a skilled occupation on the relevant list.", recommendation: "TSS Visa (Subclass 482)", color: "gold" },
          { icon: Award, title: "Independent Skilled Migration", description: "If you want permanent residency based on your skills without employer sponsorship — through a points-based system.", recommendation: "Skilled Independent Visa (189)", color: "primary" },
        ],
        faqs: [
          { q: "Do I need an employer sponsor for an Australian work visa?", a: "The TSS Visa (482) requires employer sponsorship. The Skilled Independent Visa (189) does not — it is points-based and you apply independently." },
          { q: "Can the TSS visa lead to permanent residency?", a: "Yes, the medium-term stream of the TSS Visa provides a pathway to permanent residency through the Employer Nomination Scheme (Subclass 186) after 3 years." },
          { q: "How many points do I need for the Subclass 189?", a: "The minimum pass mark is 65 points, but competitive scores are typically 80–90+ depending on the occupation and invitation round." },
          { q: "Can my family come with me?", a: "Yes, both visa types allow you to include your partner and dependent children. They receive full work and study rights in Australia." },
          { q: "What is a skills assessment?", a: "A skills assessment is an evaluation by a relevant Australian authority confirming that your qualifications and experience meet Australian standards for your nominated occupation." },
          { q: "How long does the process take?", a: "The TSS Visa typically takes 1–4 months. The Skilled Independent Visa (189) takes 6–12 months from skills assessment through to visa grant." },
        ],
        documents: [
          "Valid Passport",
          "Skills Assessment Result",
          "English Language Test Results (IELTS or equivalent)",
          "Evidence of Qualifications",
          "Employment References (2+ years)",
          "Police Clearance Certificates",
          "Health Examination Results",
          "Employer Nomination Documents (for TSS 482)",
        ],
        ctaTitle: "Ready to Start Your Australia Work Visa Application?",
        ctaText: "Submit your details and we will help assess the most suitable Australia work visa pathway for your skills and experience.",
      }}
    />
  );
}
