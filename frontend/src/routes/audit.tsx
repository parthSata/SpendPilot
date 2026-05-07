import { createFileRoute } from "@tanstack/react-router";
import { AuditPage } from "@/components";

export const Route = createFileRoute("/audit")({
  head: () => ({
    meta: [
      { title: "Run your AI Spend Audit — SpendPilot" },
      { name: "description", content: "Multi-step audit to find AI spend savings across your team." },
    ],
  }),
  component: AuditPage,
});
