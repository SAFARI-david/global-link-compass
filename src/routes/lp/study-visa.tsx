import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/LandingPage";

export const Route = createFileRoute("/lp/study-visa")({
  head: () => ({
    meta: [
      { title: "Study Abroad — Apply Now | Global Link Migration" },
      { name: "description", content: "Find the perfect study program abroad. UK, Canada, Australia & more. Start your application in 30 seconds." },
      { property: "og:title", content: "Study Abroad — Start Your Application" },
      { property: "og:description", content: "Answer a few questions and get matched with study programs that fit your budget and goals." },
    ],
  }),
  component: () => <LandingPage variant="study" />,
});
