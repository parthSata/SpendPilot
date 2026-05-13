import { createFileRoute } from "@tanstack/react-router";
import { ResultsPage } from "@/components";
import { getLatestStoredShareId } from "@/lib/audit-local-storage";
import { SAMPLE_SHARE_ID } from "@/lib/sample-audit";

export const Route = createFileRoute("/results")({
  /** Bare `/results` or `?shareId=` should still open a report (latest on device, else sample). */
  validateSearch: (search: Record<string, unknown>) => {
    const raw = typeof search.shareId === "string" ? search.shareId.trim() : "";
    if (raw) return { shareId: raw };
    const latest = typeof window !== "undefined" ? getLatestStoredShareId() : null;
    return { shareId: latest ?? SAMPLE_SHARE_ID };
  },
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
