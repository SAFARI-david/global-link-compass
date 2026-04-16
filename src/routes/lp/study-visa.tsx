import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/LandingPage";

export const Route = createFileRoute("/lp/study-visa")({
  head: () => ({
    meta: [
      { title: "Study Abroad — Free Assessment | Global Link Migration" },
      { name: "description", content: "Find the perfect study program abroad. UK, Canada, Australia & more. Free 30-second assessment." },
      { property: "og:title", content: "Study Abroad — Free Assessment" },
      { property: "og:description", content: "Answer a few questions and get matched with study programs that fit your budget and goals." },
    ],
  }),
  component: () => <LandingPage variant="study" />,
});
