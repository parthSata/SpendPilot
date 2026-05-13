export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5555/api";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

const parseError = async (response: Response) => {
  try {
    const body = (await response.json()) as { message?: string };
    return body.message || "Request failed";
  } catch {
    return "Request failed";
  }
};

const request = async <T>(path: string, options?: RequestInit) => {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(await parseError(response));
  }

  return (await response.json()) as ApiResponse<T>;
};

export type AuditToolPayload = {
  toolName: string;
  currentPlan: string;
  monthlySpend: number;
  seats: number;
};

export type RunAuditResponse = {
  auditId: string;
  shareId: string;
  teamSize: number;
  primaryUseCase: string;
  usageIntensity?: string;
  totalMonthlySpend: number;
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  auditScore: number;
  aiSummary: string;
  pricingLastUpdated?: string;
  tools: Array<{
    toolName: string;
    currentPlan: string;
    monthlySpend: number;
    seats: number;
    wastedSeats?: number;
    recommendedPlan: string;
    recommendedTool: string;
    monthlySavings: number;
    annualSavings: number;
    reason: string;
    recommendationType?: string;
    emoji?: string;
    source?: string;
    sourceUrl?: string;
  }>;
};

export type SharedAuditResponse = RunAuditResponse & {
  views: number;
  createdAt: string;
};

export const runAuditApi = (payload: {
  teamSize: number;
  primaryUseCase: "coding" | "writing" | "research" | "data" | "mixed";
  usageIntensity?: "light" | "medium" | "heavy";
  tools: AuditToolPayload[];
  /** Honeypot — must stay empty (bots often fill hidden website fields). */
  website?: string;
  lead?: { email: string; companyName?: string; role?: string };
}) =>
  request<RunAuditResponse>("/audit/run", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getSharedAuditApi = (shareId: string) =>
  request<SharedAuditResponse>(`/audit/share/${shareId}`, {
    method: "GET",
  });

export const sendAuditEmailApi = (payload: { auditId: string; email: string }) =>
  request<{}>("/audit/send-email", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const bookConsultationApi = (payload: {
  email: string;
  companyName: string;
  role?: string;
}) =>
  request<{}>("/audit/consultation", {
    method: "POST",
    body: JSON.stringify(payload),
  });
