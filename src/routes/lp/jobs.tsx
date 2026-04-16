import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/LandingPage";

export const Route = createFileRoute("/lp/jobs")({
  head: () => ({
    meta: [
      { title: "Visa-Sponsored Jobs — Free Assessment | Global Link Migration" },
      { name: "description", content: "Find visa-sponsored jobs in Canada, UK, UAE, Australia & more. Free 30-second assessment." },
      { property: "og:title", content: "Visa-Sponsored Jobs — Free Assessment" },
      { property: "og:description", content: "Tell us what you're looking for and get matched with visa-sponsored job opportunities." },
    ],
  }),
  component: () => <LandingPage variant="jobs" />,
});
