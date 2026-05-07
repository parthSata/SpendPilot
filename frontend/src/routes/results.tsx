import { createFileRoute } from "@tanstack/react-router";
import { ResultsPage } from "@/components/features/results/ResultsPage";

export const Route = createFileRoute("/results")({
  head: () => ({
    meta: [
      { title: "Your AI Spend Audit Results — SpendPilot" },
      { name: "description", content: "Personalized AI spending analysis with tool-by-tool savings recommendations." },
    ],
  }),
  component: ResultsPage,
});
