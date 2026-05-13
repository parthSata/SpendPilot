import type { SharedAuditResponse } from "@/lib/audit-api";

const STORAGE_KEY = "spendpilot_audit_reports_v1";
const MAX_STORED = 25;

export const REPORTS_UPDATED_EVENT = "spendpilot:reports-updated";

type StoredEntry = {
  savedAt: string;
  data: SharedAuditResponse;
};

function readMap(): Record<string, StoredEntry> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, StoredEntry>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeMap(map: Record<string, StoredEntry>) {
  if (typeof window === "undefined") return;
  const keys = Object.keys(map).sort((a, b) => (map[b].savedAt > map[a].savedAt ? 1 : -1));
  const trimmed: Record<string, StoredEntry> = {};
  for (const k of keys.slice(0, MAX_STORED)) {
    trimmed[k] = map[k];
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

/** Persist a report after a successful audit so `/results` can reload offline or when the server has no row yet. */
export function saveAuditReport(data: RunAuditLike): void {
  const shareId = data.shareId?.trim();
  if (!shareId) return;

  const full: SharedAuditResponse = {
    ...data,
    shareId,
    views: typeof data.views === "number" ? data.views : 0,
    createdAt: data.createdAt || new Date().toISOString(),
  } as SharedAuditResponse;

  const map = readMap();
  map[shareId] = { savedAt: new Date().toISOString(), data: full };
  writeMap(map);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(REPORTS_UPDATED_EVENT));
  }
}

type RunAuditLike = Partial<SharedAuditResponse> & {
  shareId: string;
  auditId: string;
  teamSize: number;
  primaryUseCase: string;
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  auditScore: number;
  aiSummary: string;
  tools: SharedAuditResponse["tools"];
};

export function loadAuditReport(shareId: string): SharedAuditResponse | null {
  const map = readMap();
  return map[shareId]?.data ?? null;
}

export function getLatestStoredShareId(): string | null {
  const map = readMap();
  let best: { id: string; t: string } | null = null;
  for (const [id, entry] of Object.entries(map)) {
    if (!best || entry.savedAt > best.t) best = { id, t: entry.savedAt };
  }
  return best?.id ?? null;
}

/** Summaries for homepage / history UI — oldest saved first (full history top to bottom). */
export type StoredReportListItem = {
  shareId: string;
  savedAt: string;
  teamSize: number;
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  auditScore: number;
};

export function listStoredAuditReports(): StoredReportListItem[] {
  const map = readMap();
  return Object.entries(map)
    .map(([shareId, entry]) => ({
      shareId,
      savedAt: entry.savedAt,
      teamSize: entry.data.teamSize,
      totalMonthlySpend: entry.data.totalMonthlySpend,
      totalMonthlySavings: entry.data.totalMonthlySavings,
      auditScore: entry.data.auditScore ?? 0,
    }))
    .sort((a, b) => (a.savedAt > b.savedAt ? 1 : -1));
}
