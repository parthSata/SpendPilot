import { createFileRoute } from "@tanstack/react-router";
import { PublicReportPage } from "@/components/features/report/PublicReportPage";

export const Route = createFileRoute("/report/$shareId")({
  head: () => ({
    meta: [
      { title: "SpendPilot public report" },
      { name: "description", content: "Public AI spend audit report." },
      { property: "og:type", content: "article" },
    ],
  }),
  component: ReportRoutePage,
});

function ReportRoutePage() {
  const { shareId } = Route.useParams();
  return <PublicReportPage shareId={shareId} />;
}
