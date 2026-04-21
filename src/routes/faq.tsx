import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Global Link Migration Services" },
      { name: "description", content: "Answers to common questions about work visas, study visas, pricing, the application process, and timelines." },
      { property: "og:title", content: "Frequently Asked Questions — Global Link" },
      { property: "og:description", content: "Get clear answers about visa applications, fees, timelines, and how Global Link supports your journey." },
    ],
  }),
  component: FaqPage,
});

type Faq = { q: string; a: string };
type Category = { title: string; description: string; faqs: Faq[] };

const categories: Category[] = [
  {
    title: "General",
    description: "Who we are and how we work.",
    faqs: [
      { q: "What does Global Link Migration Services do?", a: "We provide professional application support and guidance for work visas, study visas, visit visas, and international job placements. Our licensed advisors help you choose the right program, prepare your documents, and submit a complete, well-presented application." },
      { q: "Are you a licensed immigration firm?", a: "Yes. We work with licensed immigration advisors and consultants. We are not a government body, and final decisions on visa approvals are always made by the relevant immigration authorities, embassies, and consulates." },
      { q: "Do you guarantee visa approval?", a: "No. No legitimate firm can guarantee a visa outcome — only the issuing government can approve a visa. What we guarantee is a thorough eligibility assessment, a complete and compliant application, and full support throughout the process." },
      { q: "Which countries do you cover?", a: "We currently support applications for Canada, the United Kingdom, Australia, Germany, and the United Arab Emirates, across work visas, study visas, and visit/tourist visas." },
    ],
  },
  {
    title: "Work Visas",
    description: "LMIA, skilled worker, and employer-sponsored programs.",
    faqs: [
      { q: "Which Canada work visa programs do you handle?", a: "We support the LMIA-based Work Permit, the Francophone Mobility Program, and Express Entry Work Immigration pathways. The right one depends on your job offer, language ability, and qualifications." },
      { q: "Do I need a job offer to apply for a work visa?", a: "It depends on the program. LMIA and most employer-sponsored visas require a confirmed job offer. Some pathways (like Express Entry or Germany's Job Seeker Visa) allow you to apply without one." },
      { q: "Can I bring my family on a work visa?", a: "Most work visa programs allow spouses and dependent children to accompany you. Eligibility, work rights for your spouse, and school access for children vary by country and program." },
      { q: "Will you help me find a job abroad?", a: "We are not a recruitment agency, but we maintain a curated jobs board and partner network. We help you understand which roles match your visa eligibility and prepare a strong application." },
    ],
  },
  {
    title: "Study Visas",
    description: "Student permits and post-study work options.",
    faqs: [
      { q: "Which study visa programs do you support?", a: "We support student visa applications for universities and accredited institutions in the UK, Canada, Australia, and Germany, including post-study work routes such as the UK Graduate Route." },
      { q: "Do I need an admission letter before applying for a study visa?", a: "Yes. Most study visa applications require a confirmed admission or acceptance letter (e.g. CAS for the UK, Letter of Acceptance for Canada) before the visa application can be lodged." },
      { q: "Can I work while studying?", a: "Most study visas allow part-time work during term (typically up to 20 hours/week) and full-time during scheduled breaks. Exact rules depend on the country and your level of study." },
      { q: "Can I stay and work after I graduate?", a: "Several countries offer post-study work routes — for example the UK Graduate Route (2–3 years) and Canada's Post-Graduation Work Permit. We help you plan from study to work to permanent residence where applicable." },
    ],
  },
  {
    title: "Visit Visas",
    description: "Tourist visas, family visits, and business travel.",
    faqs: [
      { q: "What types of visit visas do you handle?", a: "We support tourist visas, family visit visas, business visitor visas, and medical visit visas for Canada, the UK, Australia, Schengen countries, UAE, and the United States." },
      { q: "Do I need an invitation letter for a visit visa?", a: "It depends on the country and purpose. Family visits and some business trips typically require an invitation or sponsorship letter. Tourist visas usually require proof of accommodation and a travel itinerary instead." },
      { q: "How long can I stay on a visit visa?", a: "Visit visa durations vary by country — typically 30 days (UAE), up to 6 months (UK Standard Visitor Visa, Canada TRV), or 90 days within a 180-day period (Schengen). Your visa will specify the permitted stay." },
      { q: "Can I work on a visit visa?", a: "No. Visit visas do not permit employment. If you intend to work, you will need a work visa or work permit instead. We can help you identify the right pathway." },
      { q: "What documents do I need for a visit visa?", a: "Common requirements include a valid passport, financial proof (bank statements), travel itinerary, accommodation details, travel insurance, and — for family visits — an invitation letter. Requirements vary by destination." },
    ],
  },
  {
    title: "Pricing & Fees",
    description: "What you pay and what's included.",
    faqs: [
      { q: "What is included in your service fee?", a: "Our service fee is all-inclusive. It covers eligibility assessment, document preparation and review, application form completion, submission support, and ongoing case management. Government and embassy fees are included in the service fee shown on each program page — there are no surprise charges added later." },
      { q: "Are government and embassy fees included?", a: "Yes. The service fee displayed on each program page already includes the relevant government, embassy, and consular processing fees for that specific program. The price you see is the price you pay." },
      { q: "Are there any costs that are NOT included?", a: "A small number of third-party costs are paid directly by you to the provider and are not part of our fee — for example language tests (IELTS, PTE), medical examinations, biometrics where required, courier services, and translation/notarisation of personal documents. These are clearly listed under 'What is not included' on each program page." },
      { q: "When do I pay?", a: "You can submit your application and complete your eligibility assessment without paying. Service fees are only charged once you confirm you'd like to proceed with our full application support." },
      { q: "Do you offer refunds?", a: "Refund eligibility depends on the stage of your application and is detailed in our service agreement. If a visa is refused, we'll discuss reapplication or alternative pathways with you." },
    ],
  },
  {
    title: "Application Process",
    description: "From eligibility check to decision.",
    faqs: [
      { q: "How do I get started?", a: "Begin with our free eligibility check or submit a short application form. One of our advisors will review your profile, recommend suitable programs, and outline the next steps." },
      { q: "What documents will I need?", a: "Document requirements vary by program, but typically include a valid passport, qualifications, work experience proof, language test results, and financial evidence. Each program page lists its full document checklist." },
      { q: "Can I track my application?", a: "Yes. Once you create an account, you'll have access to your dashboard where you can upload documents, view status updates, message your case officer, and track each stage of your application." },
      { q: "Who handles my application?", a: "Each application is assigned to a dedicated case officer who guides you from start to finish. Your case officer is your single point of contact throughout the process." },
    ],
  },
  {
    title: "Timelines",
    description: "How long things take.",
    faqs: [
      { q: "How long does the whole process take?", a: "End-to-end timelines depend heavily on the program and country. Document preparation typically takes 2–6 weeks; government processing can range from a few weeks (e.g. UAE work permits) to 6–12 months (e.g. Express Entry). Each program page shows the current expected processing time." },
      { q: "How quickly will I hear back after submitting an enquiry?", a: "Our team typically responds to new enquiries within one business day. Eligibility assessments are usually completed within 2–3 business days." },
      { q: "Can I speed up my visa processing?", a: "Some countries offer priority or premium processing for an additional government fee (e.g. UK priority service). Where available, we'll let you know the cost and expected time savings." },
      { q: "What happens if my visa is delayed?", a: "Processing delays do happen. Your case officer will monitor your application, follow up with the relevant authority where appropriate, and keep you informed throughout." },
    ],
  },
];

function FaqPage() {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div>
      {/* Hero */}
      <section className="bg-navy-gradient text-primary-foreground py-16 lg:py-20">
        <div className="container-narrow text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-gold/20 mb-4">
            <HelpCircle className="h-6 w-6 text-gold" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight lg:text-5xl mb-3 font-heading">Frequently Asked Questions</h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto">
            Clear answers about visas, pricing, and our process. Government and embassy fees are included in the service fee shown on every program page.
          </p>
        </div>
      </section>

      {/* FAQ list */}
      <div className="container-narrow py-12 lg:py-16 space-y-12">
        {categories.map((cat) => (
          <section key={cat.title}>
            <div className="mb-5">
              <h2 className="text-2xl font-bold font-heading">{cat.title}</h2>
              <p className="text-sm text-muted-foreground mt-1">{cat.description}</p>
            </div>
            <div className="space-y-3">
              {cat.faqs.map((faq, i) => {
                const key = `${cat.title}-${i}`;
                const isOpen = open === key;
                return (
                  <div key={key} className="rounded-lg border bg-card">
                    <button
                      className="flex w-full items-center justify-between p-5 text-left"
                      onClick={() => setOpen(isOpen ? null : key)}
                      aria-expanded={isOpen}
                    >
                      <span className="font-medium pr-4">{faq.q}</span>
                      {isOpen ? <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />}
                    </button>
                    {isOpen && (
                      <div className="border-t px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        ))}

        {/* CTA */}
        <section className="rounded-2xl bg-navy-gradient text-primary-foreground p-8 lg:p-12 text-center">
          <h2 className="text-2xl font-bold mb-3 font-heading">Still have questions?</h2>
          <p className="opacity-80 mb-6 max-w-xl mx-auto">
            Our advisors are ready to walk you through your options and recommend the right pathway for your goals.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/contact">
              <Button variant="heroGold" size="lg">
                Contact an Advisor <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/services">
              <Button variant="heroOutline" size="lg">Browse All Services</Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
