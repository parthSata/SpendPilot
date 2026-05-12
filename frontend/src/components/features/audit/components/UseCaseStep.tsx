import { motion } from "framer-motion";

interface UseCaseStepProps {
  useCase: string;
  useCases: ReadonlyArray<{ id: string; title: string; desc: string }>;
  setUseCase: (v: string) => void;
  usageIntensity: "light" | "medium" | "heavy";
  setUsageIntensity: (v: "light" | "medium" | "heavy") => void;
}

export function UseCaseStep({
  useCase,
  useCases,
  setUseCase,
  usageIntensity,
  setUsageIntensity,
}: UseCaseStepProps) {
  const intensityOptions: { id: "light" | "medium" | "heavy"; title: string; desc: string }[] = [
    { id: "light", title: "Light", desc: "Occasional prompts, low daily volume" },
    { id: "medium", title: "Medium", desc: "Regular daily use across the team" },
    { id: "heavy", title: "Heavy", desc: "High volume / near limits — assume downgrade risk" },
  ];

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold">What's your primary use case?</h2>
      <p className="mt-2 text-muted-foreground text-sm">Helps us tune recommendations to your workflow.</p>
      <div className="mt-6 grid sm:grid-cols-2 gap-3">
        {useCases.map((c) => (
          <motion.button
            key={c.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => setUseCase(c.id)}
            className={`text-left p-5 rounded-xl border transition ${
              useCase === c.id ? "border-(--electric)/60 bg-(--electric)/10" : "border-white/10 bg-white/5 hover:bg-white/10"
            }`}
          >
            <div className="font-semibold">{c.title}</div>
            <div className="mt-1 text-sm text-muted-foreground">{c.desc}</div>
          </motion.button>
        ))}
      </div>

      <h3 className="mt-10 text-lg font-semibold">How hard do you run these tools?</h3>
      <p className="mt-1 text-muted-foreground text-sm">
        Heavy usage blocks naive &quot;downgrade to free&quot; suggestions so savings stay realistic.
      </p>
      <div className="mt-4 grid sm:grid-cols-3 gap-3">
        {intensityOptions.map((opt) => (
          <motion.button
            key={opt.id}
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={() => setUsageIntensity(opt.id)}
            className={`text-left p-4 rounded-xl border transition text-sm ${
              usageIntensity === opt.id
                ? "border-violet-500/60 bg-violet-500/10"
                : "border-white/10 bg-white/5 hover:bg-white/10"
            }`}
          >
            <div className="font-semibold">{opt.title}</div>
            <div className="mt-1 text-xs text-muted-foreground">{opt.desc}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
