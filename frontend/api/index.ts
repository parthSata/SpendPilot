export const config = {
  runtime: "edge",
};

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("../dist/server/index.js").then(
      (module) => (module as { default?: ServerEntry }).default ?? (module as unknown as ServerEntry),
    );
  }

  return serverEntryPromise;
}

export default async function handler(request: Request, context: { waitUntil: (promise: Promise<unknown>) => void }) {
  const serverEntry = await getServerEntry();
  return serverEntry.fetch(request, undefined, context);
}
