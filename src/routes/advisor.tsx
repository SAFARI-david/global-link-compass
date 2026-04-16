import { createFileRoute } from "@tanstack/react-router";
import { AdvisorChat } from "@/components/AdvisorChat";

export const Route = createFileRoute("/advisor")({
  head: () => ({
    meta: [
      { title: "AI Program Advisor — Global Link Migration Services" },
      { name: "description", content: "Get personalized visa program recommendations from our AI advisor. Answer a few simple questions and find the right path." },
      { property: "og:title", content: "AI Program Advisor — Global Link Migration Services" },
      { property: "og:description", content: "Get personalized visa program recommendations from our AI advisor." },
    ],
  }),
  component: AdvisorPage,
});

function AdvisorPage() {
  return <AdvisorChat />;
}
