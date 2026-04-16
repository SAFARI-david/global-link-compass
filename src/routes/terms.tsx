import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Global Link Migration Services" },
      { name: "description", content: "Terms and conditions governing your use of Global Link Migration Services." },
      { property: "og:title", content: "Terms & Conditions — Global Link Migration Services" },
      { property: "og:description", content: "Terms governing the use of our application support services." },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-narrow section-padding">
        <article className="prose prose-slate mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold md:text-4xl">Terms &amp; Conditions</h1>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: April 2026</p>

          <section className="mt-8 space-y-4 text-sm leading-relaxed text-foreground/85">
            <h2 className="text-xl font-bold text-foreground">1. Agreement</h2>
            <p>
              By using the Global Link Migration Services website or engaging our services, you agree to these Terms &amp; Conditions. If you do not agree, please do not use our services.
            </p>

            <h2 className="text-xl font-bold text-foreground">2. Nature of our services</h2>
            <p>
              We provide professional application support services. We help you understand requirements, prepare documentation, complete forms correctly and submit applications. We are not an embassy, consulate, government agency or educational institution. We do not issue visas, admissions or job offers.
            </p>

            <h2 className="text-xl font-bold text-foreground">3. No guarantee of outcome</h2>
            <p>
              Final decisions on visa applications, admissions and job offers are made solely by the relevant immigration authorities, embassies, consulates, institutions and employers. We cannot and do not guarantee approval, admission or placement.
            </p>

            <h2 className="text-xl font-bold text-foreground">4. Service fees</h2>
            <p>
              Our service fees cover only the professional support we provide. Government fees, embassy fees, language test fees, medical exams, translations, credential evaluations, tuition, travel and insurance are not included and must be paid directly to the relevant third party.
            </p>

            <h2 className="text-xl font-bold text-foreground">5. Refund policy</h2>
            <p>
              Service fees pay for time and expertise already delivered. Refunds may be considered case-by-case where work has not yet started. Once preparation, document review or submission has begun, fees are generally non-refundable. Government and third-party fees are never refundable through us.
            </p>

            <h2 className="text-xl font-bold text-foreground">6. Your responsibilities</h2>
            <p>You agree to:</p>
            <ul className="ml-5 list-disc space-y-1">
              <li>Provide accurate, complete and truthful information and documents</li>
              <li>Respond to requests for information in a timely manner</li>
              <li>Pay government, embassy and third-party fees directly when required</li>
              <li>Not submit forged, fraudulent or misleading documents</li>
            </ul>
            <p>
              Submitting false information may lead to refusal of your application by authorities and immediate termination of our services without refund.
            </p>

            <h2 className="text-xl font-bold text-foreground">7. Account &amp; data</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account credentials. We process your data in accordance with our <a href="/privacy" className="text-primary underline">Privacy Policy</a>.
            </p>

            <h2 className="text-xl font-bold text-foreground">8. Limitation of liability</h2>
            <p>
              To the maximum extent permitted by law, our total liability for any claim arising from our services is limited to the amount of service fees you have actually paid us in the 12 months preceding the claim. We are not liable for outcomes determined by third-party authorities.
            </p>

            <h2 className="text-xl font-bold text-foreground">9. Changes to these terms</h2>
            <p>We may update these terms. Continued use after changes are posted constitutes acceptance of the new terms.</p>

            <h2 className="text-xl font-bold text-foreground">10. Contact</h2>
            <p>
              For questions about these terms, email <a href="mailto:info@global-linkmigration.ca" className="text-primary underline">info@global-linkmigration.ca</a>.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
