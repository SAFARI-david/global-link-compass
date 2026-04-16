import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Disclaimer — Global Link Migration Services" },
      { name: "description", content: "Important information about the limits of our application support services." },
      { property: "og:title", content: "Disclaimer — Global Link Migration Services" },
      { property: "og:description", content: "Important information about the limits of our services." },
    ],
  }),
  component: DisclaimerPage,
});

function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container-narrow section-padding">
        <article className="mx-auto max-w-3xl">
          <h1 className="text-3xl font-bold md:text-4xl">Disclaimer</h1>
          <p className="mt-2 text-sm text-muted-foreground">Last updated: April 2026</p>

          <div className="mt-8 rounded-xl border border-amber-200/60 bg-amber-50/40 p-5">
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <p className="text-sm leading-relaxed text-amber-900">
                <strong>We provide professional application support services.</strong> Final decisions are made by immigration authorities, embassies, consulates, institutions, and employers.
              </p>
            </div>
          </div>

          <section className="mt-8 space-y-4 text-sm leading-relaxed text-foreground/85">
            <h2 className="text-xl font-bold text-foreground">No guarantee of approval</h2>
            <p>
              Submission of an application does not guarantee approval. Outcomes depend entirely on the discretion of the relevant authority assessing your file (immigration authority, embassy, consulate, university, employer, etc.).
            </p>

            <h2 className="text-xl font-bold text-foreground">Not legal advice</h2>
            <p>
              Information provided on this website and through our services is for general guidance only. It is not legal advice and does not create a lawyer–client relationship. For complex cases involving prior refusals, criminal history, or inadmissibility, we recommend consulting a licensed immigration lawyer.
            </p>

            <h2 className="text-xl font-bold text-foreground">Service fees vs government fees</h2>
            <p>
              Our published prices cover only our professional service fees. They do <strong>not</strong> include government fees, embassy fees, biometrics, medical examinations, language testing, translations, credential evaluations, tuition or travel costs. These are paid directly to the relevant third party and are non-refundable through us.
            </p>

            <h2 className="text-xl font-bold text-foreground">Information accuracy</h2>
            <p>
              Immigration rules, fees, and processing times change regularly. While we work to keep our information current, we cannot guarantee it is up to date at every moment. Always confirm critical details with the official source before making major decisions.
            </p>

            <h2 className="text-xl font-bold text-foreground">Third-party content</h2>
            <p>
              We may link to third-party websites for your convenience. We are not responsible for the content, accuracy, or practices of those sites.
            </p>

            <h2 className="text-xl font-bold text-foreground">Contact</h2>
            <p>
              Questions? Email <a href="mailto:info@global-linkmigration.ca" className="text-primary underline">info@global-linkmigration.ca</a>.
            </p>
          </section>
        </article>
      </div>
    </div>
  );
}
