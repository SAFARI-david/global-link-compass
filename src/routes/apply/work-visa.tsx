import { createFileRoute } from "@tanstack/react-router";
import { WorkVisaForm } from "@/components/WorkVisaForm";

export const Route = createFileRoute("/apply/work-visa")({
  head: () => ({
    meta: [
      { title: "Apply for Work Visa — Global Link Migration Services" },
      { name: "description", content: "Start your work visa application with our structured, step-by-step form. Professional support throughout the process." },
      { property: "og:title", content: "Apply for Work Visa — Global Link Migration Services" },
      { property: "og:description", content: "Start your work visa application with our structured, step-by-step form." },
    ],
  }),
  component: WorkVisaPage,
});

function WorkVisaPage() {
  return <WorkVisaForm />;
}
