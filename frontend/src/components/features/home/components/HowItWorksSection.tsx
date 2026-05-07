import { motion } from "framer-motion";
import type { LandingFlowStep } from "@/hooks/useLandingPage";
import { SectionHeader } from "@/components/features/home/components/SectionHeader";

type HowItWorksSectionProps = {
  flowSteps: LandingFlowStep[];
};

export function HowItWorksSection({ flowSteps }: HowItWorksSectionProps) {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          tag="How it works"
          title="From spend chaos to clarity in 3 steps"
          subtitle="No integrations. No spreadsheets. No procurement meetings."
        />
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {flowSteps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="group relative glass-strong rounded-2xl p-8 hover:bg-white/[0.07] transition gradient-border"
            >
              <div className="text-xs font-mono text-muted-foreground">0{i + 1}</div>
              <div className="mt-4 h-12 w-12 rounded-xl bg-linear-to-br from-electric to-violet grid place-items-center group-hover:scale-110 transition">
                <step.icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="mt-5 text-xl font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
