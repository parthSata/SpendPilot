import { createFileRoute } from "@tanstack/react-router";
import { PublicReportPage } from "@/components/features/report/PublicReportPage";

export const Route = createFileRoute("/report/$shareId")({
  head: () => ({
    meta: [
      { title: "SpendPilot | AI Savings Report" },
      { name: "description", content: "Check out the AI cost audit report for this team. Find your own savings on SpendPilot." },
      { property: "og:title", content: "AI Savings Report - SpendPilot" },
      { property: "og:description", content: "This team identified significant savings on their AI tool stack. Audit your spend now." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AI Savings Report - SpendPilot" },
      { name: "twitter:description", content: "Audit your startup's AI spend in 2 minutes." },
    ],
  }),
  component: ReportRoutePage,
});

function ReportRoutePage() {
  const { shareId } = Route.useParams();
  return <PublicReportPage shareId={shareId} />;
}
