import { motion } from "framer-motion";

interface UseCaseStepProps {
  useCase: string;
  useCases: ReadonlyArray<{ id: string; title: string; desc: string }>;
  setUseCase: (v: string) => void;
}

export function UseCaseStep({
  useCase,
  useCases,
  setUseCase,
}: UseCaseStepProps) {
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
    </div>
  );
}
