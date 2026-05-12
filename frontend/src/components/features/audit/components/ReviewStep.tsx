import { useMemo } from "react";
import { PRICING_DATA } from "@/lib/pricing/pricing";
import type { SelectedTools } from "@/hooks/useAuditFlow";

interface ReviewStepProps {
  selected: SelectedTools;
  teamSize: number;
  useCase: string;
  usageIntensity: "light" | "medium" | "heavy";
}

export function ReviewStep({
  selected,
  teamSize,
  useCase,
  usageIntensity,
}: ReviewStepProps) {
  const items = useMemo(
    () =>
      Object.entries(selected).map(([id, state]) => {
        const tool = PRICING_DATA[id as keyof typeof PRICING_DATA]!;
        const cost = tool.plans[state.plan as keyof typeof tool.plans] || 0;
        const price = typeof cost === "number" ? cost : 0;
        return {
          id,
          name: tool.label,
          color: tool.color,
          logo: tool.logo,
          plan: state.plan,
          seats: state.seats,
          wasted: Math.max(0, state.seats - teamSize),
          price,
        };
      }),
    [selected, teamSize],
  );

  return (
    <div>
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
                {i.seats} {i.seats === 1 ? "seat" : "seats"} @ ${i.price}/mo
              </div>
            </div>
            <div className="text-sm font-mono font-bold">${(i.seats * i.price).toLocaleString()}</div>
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
          <div className="mt-1 font-semibold capitalize">{useCase}</div>
        </div>
        <div className="glass rounded-xl p-4 col-span-2 sm:col-span-1">
          <div className="text-xs text-muted-foreground">Usage intensity</div>
          <div className="mt-1 font-semibold capitalize">{usageIntensity}</div>
        </div>
      </div>
    </div>
  );
}
