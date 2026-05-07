import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { SavingsExample } from "@/hooks/useLandingPage";
import { SectionHeader } from "@/components/features/home/components/SectionHeader";

type SavingsExamplesSectionProps = {
  savingsExamples: SavingsExample[];
};

export function SavingsExamplesSection({ savingsExamples }: SavingsExamplesSectionProps) {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          tag="Real savings"
          title="Teams like yours are saving thousands"
          subtitle="Anonymized from real audits this month."
        />
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {savingsExamples.map((example, i) => {
            const pct = Math.round(((example.before - example.after) / example.before) * 100);
            return (
              <motion.div
                key={example.team}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-strong rounded-2xl p-6 hover:-translate-y-1 transition"
              >
                <div className="text-xs uppercase tracking-wider text-muted-foreground">{example.team}</div>
                <div className="mt-4 flex items-baseline gap-2">
                  <span className="text-4xl font-bold gradient-text">${example.before - example.after}</span>
                  <span className="text-sm text-muted-foreground">/ mo saved</span>
                </div>
                <div className="mt-2 text-xs text-success">↓ {pct}% reduction</div>
                <div className="mt-6 flex items-center justify-between text-sm">
                  <span className="text-muted-foreground line-through">${example.before}/mo</span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  <span className="font-semibold">${example.after}/mo</span>
                </div>
                <div className="mt-6 flex flex-wrap gap-1.5">
                  {example.tools.map((tool) => (
                    <span key={tool} className="text-xs px-2 py-1 rounded-md bg-white/5 border border-white/10">{tool}</span>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
