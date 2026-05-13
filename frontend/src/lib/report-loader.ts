import { getSharedAuditApi, type SharedAuditResponse } from "@/lib/audit-api";
import { loadAuditReport } from "@/lib/audit-local-storage";
import { SAMPLE_SHARED_AUDIT, SAMPLE_SHARE_ID } from "@/lib/sample-audit";

export type AuditLoadSource = "sample" | "network" | "local";

export async function fetchAuditForDisplay(shareId: string): Promise<{
  data: SharedAuditResponse;
  source: AuditLoadSource;
}> {
  const id = shareId.trim();
  if (id === SAMPLE_SHARE_ID) {
    return { data: SAMPLE_SHARED_AUDIT, source: "sample" };
  }

  try {
    const response = await getSharedAuditApi(id);
    return { data: response.data, source: "network" };
  } catch {
    const local = loadAuditReport(id);
    if (local) {
      return { data: local, source: "local" };
    }
    throw new Error("Shared report not found");
  }
}
