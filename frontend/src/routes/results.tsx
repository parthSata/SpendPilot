import { createFileRoute } from "@tanstack/react-router";
import { ResultsPage } from "@/components";

export const Route = createFileRoute("/results")({
  validateSearch: (search: Record<string, unknown>) => ({
    shareId: typeof search.shareId === "string" ? search.shareId : "",
  }),
  head: () => ({
    meta: [
      { title: "Your AI Spend Audit Results — SpendPilot" },
      { name: "description", content: "Personalized AI spending analysis with tool-by-tool savings recommendations." },
    ],
  }),
  component: ResultsRoutePage,
});

function ResultsRoutePage() {
  const { shareId } = Route.useSearch();
  return <ResultsPage shareId={shareId} />;
}
