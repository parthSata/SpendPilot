import { motion } from "framer-motion";
import { AnimatedCounter } from "@/components/site/AnimatedCounter";
import type { LandingStat } from "@/hooks/useLandingPage";

type TrustBarSectionProps = {
  stats: LandingStat[];
};

export function TrustBarSection({ stats }: TrustBarSectionProps) {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-6xl glass-strong rounded-3xl p-8 md:p-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center"
            >
              <div className="text-3xl md:text-4xl font-bold gradient-text">
                <AnimatedCounter value={s.value} prefix={s.prefix} suffix={s.suffix} />
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
