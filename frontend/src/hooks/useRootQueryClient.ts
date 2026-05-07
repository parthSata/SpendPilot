import { getRouteApi } from "@tanstack/react-router";

const rootRouteApi = getRouteApi("__root__");

export function useRootQueryClient() {
  const { queryClient } = rootRouteApi.useRouteContext();
  return queryClient;
}
