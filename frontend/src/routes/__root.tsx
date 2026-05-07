import { QueryClient } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
} from "@tanstack/react-router";
import { RootDocumentShell } from "@/components/layout/RootDocumentShell";
import { AppProviders } from "@/components/providers/AppProviders";
import { RouteErrorState, RouteNotFound } from "@/components/layout/RouteFallbacks";
import { useRootQueryClient } from "@/hooks/useRootQueryClient";

import appCss from "../styles.css?url";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lovable App" },
      { name: "description", content: "Lovable Generated Project" },
      { name: "author", content: "Lovable" },
      { property: "og:title", content: "Lovable App" },
      { property: "og:description", content: "Lovable Generated Project" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@Lovable" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: RouteNotFound,
  errorComponent: RouteErrorState,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return <RootDocumentShell>{children}</RootDocumentShell>;
}

function RootComponent() {
  const queryClient = useRootQueryClient();

  return (
    <AppProviders queryClient={queryClient}>
      <Outlet />
    </AppProviders>
  );
}
