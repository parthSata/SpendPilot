import { useCallback, useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { FileText, ArrowRight } from "lucide-react";
import { listStoredAuditReports, REPORTS_UPDATED_EVENT, type StoredReportListItem } from "@/lib/audit-local-storage";
import { formatPrice, formatSavingsUsd } from "@/lib/pricing/pricing";

export function SavedReportsSection() {
  const [reports, setReports] = useState<StoredReportListItem[]>([]);

  const refresh = useCallback(() => {
    setReports(listStoredAuditReports());
  }, []);

  useEffect(() => {
    refresh();
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener(REPORTS_UPDATED_EVENT, refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener(REPORTS_UPDATED_EVENT, refresh);
    };
  }, [refresh]);

  if (reports.length === 0) {
    return null;
  }

  return (
    <section className="relative px-6 py-16 border-t border-white/5">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Your saved audits</h2>
            <p className="mt-2 text-sm text-muted-foreground max-w-xl">
              Reports you generated on this device — open any past run. New audits are added automatically.
            </p>
          </div>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2">
          {reports.map((r) => {
            const when = new Date(r.savedAt);
            const dateLabel = when.toLocaleString(undefined, {
              dateStyle: "medium",
              timeStyle: "short",
            });
            return (
              <li key={r.shareId}>
                <Link
                  to="/results"
                  search={{ shareId: r.shareId }}
                  className="group flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/4 p-4 text-left transition hover:border-electric/40 hover:bg-white/7"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="h-9 w-9 shrink-0 rounded-lg bg-linear-to-br from-electric/30 to-violet/30 grid place-items-center">
                        <FileText className="h-4 w-4 text-cyan" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs text-muted-foreground">{dateLabel}</div>
                        <div className="font-mono text-xs text-foreground/80 truncate">ID {r.shareId}</div>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:text-cyan group-hover:translate-x-0.5" />
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                    <span className="text-muted-foreground">
                      Spend <span className="text-foreground font-semibold">{formatPrice(Math.round(r.totalMonthlySpend))}</span>/mo
                    </span>
                    <span className="text-muted-foreground">
                      Save <span className="text-success font-semibold">{formatSavingsUsd(r.totalMonthlySavings)}</span>/mo
                    </span>
                    <span className="text-muted-foreground">
                      Team <span className="text-foreground font-medium">{r.teamSize}</span>
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
