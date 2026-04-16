import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/LandingPage";

export const Route = createFileRoute("/lp/jobs")({
  head: () => ({
    meta: [
      { title: "Visa-Sponsored Jobs — Apply Now | Global Link Migration" },
      { name: "description", content: "Find visa-sponsored jobs in Canada, UK, UAE, Australia & more. Start your application in 30 seconds." },
      { property: "og:title", content: "Visa-Sponsored Jobs — Apply Now" },
      { property: "og:description", content: "Tell us what you're looking for and get matched with visa-sponsored job opportunities." },
    ],
  }),
  component: () => <LandingPage variant="jobs" />,
});
