import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

type AppProvidersProps = {
  queryClient: QueryClient;
  children: React.ReactNode;
};

export function AppProviders({ queryClient, children }: AppProvidersProps) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
