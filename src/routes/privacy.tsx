import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Global Link Migration Services" },
      { name: "description", content: "How Global Link Migration Services collects, uses, stores and protects your personal information." },
      { property: "og:title", content: "Privacy Policy — Global Link Migration Services" },
      { property: "og:description", content: "How we collect, use and protect your personal information." },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-narrow section-padding">
        <article className="prose prose-slate mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold md:text-4xl">Privacy Policy</h1>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: April 2026</p>

          <section className="mt-8 space-y-4 text-sm leading-relaxed text-foreground/85">
            <h2 className="text-xl font-bold text-foreground">1. Who we are</h2>
            <p>
              Global Link Migration Services ("we", "us", "our") provides professional application support services for work visas, study visas, and related international opportunities. This Privacy Policy explains how we handle your personal information when you use our website and services.
            </p>

            <h2 className="text-xl font-bold text-foreground">2. Information we collect</h2>
            <p>We collect information you provide directly to us, including:</p>
            <ul className="ml-5 list-disc space-y-1">
              <li>Identification details (name, date of birth, nationality, passport details)</li>
              <li>Contact details (email address, phone number, country of residence)</li>
              <li>Application data (education, work history, language test results, family details)</li>
              <li>Documents you upload (passports, certificates, supporting evidence)</li>
              <li>Payment information processed by our secure payment provider</li>
              <li>Communications with our team and support requests</li>
            </ul>

            <h2 className="text-xl font-bold text-foreground">3. How we use your information</h2>
            <p>We use your information to:</p>
            <ul className="ml-5 list-disc space-y-1">
              <li>Assess your eligibility and prepare your application</li>
              <li>Communicate with you about your application status and next steps</li>
              <li>Process payments for our service fees</li>
              <li>Improve our services and user experience</li>
              <li>Comply with legal and regulatory obligations</li>
            </ul>

            <h2 className="text-xl font-bold text-foreground">4. Sharing your information</h2>
            <p>
              We may share your information with embassies, consulates, immigration authorities, educational institutions, employers, and authorised partners strictly as required to process your application. We do not sell your personal data.
            </p>

            <h2 className="text-xl font-bold text-foreground">5. Data storage and security</h2>
            <p>
              Your information is stored on secure servers with encryption in transit and at rest. We apply role-based access controls and audit logging to limit who can view your data.
            </p>

            <h2 className="text-xl font-bold text-foreground">6. Your rights</h2>
            <p>
              You have the right to access, correct, or request deletion of your personal information, subject to legal record-keeping requirements. To exercise these rights, contact us at <a href="mailto:info@global-linkmigration.ca" className="text-primary underline">info@global-linkmigration.ca</a>.
            </p>

            <h2 className="text-xl font-bold text-foreground">7. Cookies</h2>
            <p>
              We use essential cookies to keep you signed in and to remember your preferences. We may also use analytics cookies to understand site usage. You can disable non-essential cookies in your browser.
            </p>

            <h2 className="text-xl font-bold text-foreground">8. Changes to this policy</h2>
            <p>
              We may update this policy from time to time. The "Last updated" date above will reflect the most recent version.
            </p>

            <h2 className="text-xl font-bold text-foreground">9. Contact</h2>
            <p>
              For privacy questions, email <a href="mailto:info@global-linkmigration.ca" className="text-primary underline">info@global-linkmigration.ca</a>.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
