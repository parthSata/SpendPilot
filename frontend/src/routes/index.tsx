import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SpendPilot — Cut your AI subscription spend by 40%" },
      {
        name: "description",
        content:
          "AI Spend Audit for startups and engineering teams. Analyze ChatGPT, Claude, Cursor, Copilot and more to find waste and recommended savings.",
      },
      { property: "og:title", content: "SpendPilot — AI Spend Audit" },
      {
        property: "og:description",
        content: "Find your AI spending leaks in under 2 minutes.",
      },
    ],
  }),
  component: LandingPage,
});
