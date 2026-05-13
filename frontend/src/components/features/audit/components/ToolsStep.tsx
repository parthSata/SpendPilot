import { motion } from "framer-motion";
import { Check, Plus } from "lucide-react";
import { PRICING_DATA } from "@/lib/pricing/pricing";
import type { SelectedTools } from "@/hooks/useAuditFlow";

interface ToolsStepProps {
  selected: SelectedTools;
  setSelected: (s: SelectedTools) => void;
}

export function ToolsStep({ selected, setSelected }: ToolsStepProps) {
  const toggle = (toolKey: string, defaultPlan: string) => {
    const copy = { ...selected };
    if (copy[toolKey] !== undefined) {
      delete copy[toolKey];
    } else {
      copy[toolKey] = { plan: defaultPlan, seats: 5, monthlySpendActual: null };
    }
    setSelected(copy);
  };

  const updatePlan = (toolKey: string, plan: string) => {
    setSelected({
      ...selected,
      [toolKey]: { ...selected[toolKey], plan },
    });
  };

  const updateSeats = (toolKey: string, seats: number) => {
    setSelected({
      ...selected,
      [toolKey]: { ...selected[toolKey], seats: Math.min(1000, Math.max(1, seats)) },
    });
  };

  const updateMonthlySpend = (toolKey: string, raw: string) => {
    const trimmed = raw.trim();
    if (trimmed === "") {
      setSelected({
        ...selected,
        [toolKey]: { ...selected[toolKey], monthlySpendActual: null },
      });
      return;
    }
    const n = Number.parseFloat(trimmed);
    if (Number.isNaN(n) || n < 0) return;
    setSelected({
      ...selected,
      [toolKey]: { ...selected[toolKey], monthlySpendActual: n },
    });
  };

  const formatPlanLabel = (planKey: string) =>
    planKey
      .replace(/_/g, " ")
      .replace(/\bapi\b/i, "API")
      .replace(/\bdirect\b/i, "direct");
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold">Which AI tools is your team using?</h2>
      <p className="mt-2 text-muted-foreground text-sm">Tap to add. You can adjust monthly cost per tool.</p>
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Object.entries(PRICING_DATA).map(([toolKey, t]) => {
          const active = selected[toolKey] !== undefined;
          return (
            <motion.button
              key={toolKey}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 520, damping: 32 }}
              onClick={() => toggle(toolKey, Object.keys(t.plans)[0] || "free")}
              className={`relative text-left p-4 rounded-xl border transition-colors duration-150 flex flex-col min-h-[72px] ${
                active ? "border-(--electric)/60 bg-(--electric)/10 shadow-lg" : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
            >

              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-lg p-2 grid place-items-center bg-white/10 overflow-hidden"
                >
                  <img src={t.logo} alt={t.label} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">{t.label}</div>
                  <div className="text-xs text-muted-foreground truncate">{toolKey}</div>
                </div>
                <div
                  className={`h-5 w-5 rounded-full border grid place-items-center transition ${
                    active ? "bg-linear-to-br from-electric to-violet border-transparent" : "border-white/20"
                  }`}
                >
                  {active ? <Check className="h-3 w-3 text-white" /> : <Plus className="h-3 w-3 text-muted-foreground" />}
                </div>
              </div>
              {active && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.12, ease: "easeOut" }}
                  className="mt-3 space-y-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-10">Plan:</span>
                    <select
                      value={selected[toolKey].plan}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => updatePlan(toolKey, e.target.value)}
                      className="flex-1 h-8 bg-white/5 border border-white/10 rounded-md text-sm px-2 outline-none focus:border-electric"
                    >
                      {Object.entries(t.plans).map(([planName, cost]) => (
                        <option key={planName} value={planName} className="text-black bg-white">
                          {formatPlanLabel(planName)}{" "}
                          {typeof cost === "number" && cost > 0
                            ? `($${cost}/mo est.)`
                            : typeof cost === "string" && cost === "custom"
                              ? "(custom)"
                              : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-10">Seats:</span>
                    <input
                      type="number"
                      min="1"
                      max="1000"
                      value={selected[toolKey].seats}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => updateSeats(toolKey, parseInt(e.target.value) || 1)}
                      className="flex-1 h-8 bg-white/5 border border-white/10 rounded-md text-sm px-2 outline-none focus:border-electric"
                    />
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-muted-foreground w-10 shrink-0 pt-1.5">Spend:</span>
                    <div className="flex-1 min-w-0">
                      <input
                        type="number"
                        min="0"
                        step="1"
                        placeholder="Auto from plan × seats"
                        value={selected[toolKey].monthlySpendActual ?? ""}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => updateMonthlySpend(toolKey, e.target.value)}
                        className="w-full h-8 bg-white/5 border border-white/10 rounded-md text-sm px-2 outline-none focus:border-electric"
                      />
                      <p className="mt-0.5 text-[10px] text-muted-foreground leading-tight">
                        Current monthly spend for this tool (leave blank to estimate from plan × seats).
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
