import { useMemo } from "react";
import { PRICING_DATA } from "@/lib/pricing/pricing";
import type { SelectedTools } from "@/hooks/useAuditFlow";
import { USE_CASES } from "@/hooks/useAuditFlow";

interface ReviewStepProps {
  selected: SelectedTools;
  teamSize: number;
  useCase: string;
  usageIntensity: "light" | "medium" | "heavy";
  websiteHoneypot: string;
  setWebsiteHoneypot: (v: string) => void;
}

const useCaseTitle = (id: string) => USE_CASES.find((u) => u.id === id)?.title ?? id;

export function ReviewStep({
  selected,
  teamSize,
  useCase,
  usageIntensity,
  websiteHoneypot,
  setWebsiteHoneypot,
}: ReviewStepProps) {
  const items = useMemo(
    () =>
      Object.entries(selected).map(([id, state]) => {
        const tool = PRICING_DATA[id as keyof typeof PRICING_DATA]!;
        const cost = tool.plans[state.plan as keyof typeof tool.plans] || 0;
        const price = typeof cost === "number" ? cost : 0;
        const fromCatalog = state.seats * price;
        const monthlyTotal =
          typeof state.monthlySpendActual === "number" && !Number.isNaN(state.monthlySpendActual)
            ? state.monthlySpendActual
            : fromCatalog;
        return {
          id,
          name: tool.label,
          color: tool.color,
          logo: tool.logo,
          plan: state.plan,
          seats: state.seats,
          wasted: Math.max(0, state.seats - teamSize),
          price,
          monthlyTotal,
          usesDeclaredSpend: state.monthlySpendActual != null,
        };
      }),
    [selected, teamSize],
  );

  return (
    <div className="relative">
      <h2 className="text-2xl md:text-3xl font-bold">Quick review</h2>
      <p className="mt-2 text-muted-foreground text-sm">Confirm and we'll generate your savings report.</p>
      <div className="mt-6 grid gap-3">
        {items.map((i) => (
          <div key={i.id} className="glass rounded-xl p-4 flex items-center gap-3 relative overflow-hidden">
            {i.wasted > 0 && (
              <div className="absolute top-0 right-0 bg-destructive/20 text-destructive text-[10px] px-2 py-0.5 font-bold border-b border-l border-destructive/30 rounded-bl-lg uppercase tracking-tight">
                {i.wasted} Unused seats
              </div>
            )}
            <div className="h-9 w-9 rounded-lg p-1.5 grid place-items-center bg-white/10">
              <img src={i.logo} alt={i.name} className="w-full h-full object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">
                {i.name} ({i.plan})
              </div>
              <div className="text-xs text-muted-foreground">
                {i.seats} {i.seats === 1 ? "seat" : "seats"}
                {i.usesDeclaredSpend ? " · declared monthly spend" : i.price > 0 ? ` @ $${i.price}/mo/seat` : ""}
              </div>
            </div>
            <div className="text-sm font-mono font-bold">${Math.round(i.monthlyTotal).toLocaleString()}</div>
          </div>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
        <div className="glass rounded-xl p-4">
          <div className="text-xs text-muted-foreground">Team size</div>
          <div className="mt-1 font-semibold">{teamSize} people</div>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="text-xs text-muted-foreground">Use case</div>
          <div className="mt-1 font-semibold">{useCaseTitle(useCase)}</div>
        </div>
        <div className="glass rounded-xl p-4 col-span-2 sm:col-span-1">
          <div className="text-xs text-muted-foreground">Usage intensity</div>
          <div className="mt-1 font-semibold capitalize">{usageIntensity}</div>
        </div>
      </div>

      {/* Honeypot — hidden from users; bots often autofill "website" fields. */}
      <input
        id="audit-website-hp"
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden
        value={websiteHoneypot}
        onChange={(e) => setWebsiteHoneypot(e.target.value)}
        className="absolute left-[-9999px] top-0 h-px w-px opacity-0"
      />
    </div>
  );
}
