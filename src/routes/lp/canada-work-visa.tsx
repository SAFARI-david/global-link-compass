import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/LandingPage";

export const Route = createFileRoute("/lp/canada-work-visa")({
  head: () => ({
    meta: [
      { title: "Work in Canada — Free Assessment | Global Link Migration" },
      { name: "description", content: "Get matched with the right Canadian work visa program. LMIA, Express Entry, Francophone Mobility. Free 30-second assessment." },
      { property: "og:title", content: "Work in Canada — Free Assessment" },
      { property: "og:description", content: "Answer 4 quick questions and get matched with the best Canadian work visa program for you." },
    ],
  }),
  component: () => <LandingPage variant="canada-work" />,
});
