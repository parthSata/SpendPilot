import { motion } from "framer-motion";
import { Sparkles, TrendingDown } from "lucide-react";
import { AnimatedCounter } from "@/components/site/AnimatedCounter";

type ResultsHeroSectionProps = {
  monthly: number;
  yearly: number;
};

export function ResultsHeroSection({ monthly, yearly }: ResultsHeroSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <div className="absolute -inset-6 bg-linear-to-r from-(--electric)/30 via-(--violet)/30 to-(--cyan)/30 blur-3xl rounded-3xl" />
      <div className="relative glass-strong rounded-3xl p-8 md:p-12 gradient-border">
        <div className="flex items-center gap-2 text-xs">
          <Sparkles className="h-3.5 w-3.5 text-cyan" />
          <span className="uppercase tracking-wider text-muted-foreground">Your savings report</span>
        </div>
        <h1 className="mt-4 text-4xl md:text-6xl font-bold tracking-tight">You can save</h1>
        <div className="mt-4 text-7xl md:text-9xl font-bold gradient-text leading-none">
          $<AnimatedCounter value={monthly} />
        </div>
        <div className="mt-2 text-xl text-muted-foreground">per month</div>
        <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-(--success)/10 border border-(--success)/20 text-success text-sm">
          <TrendingDown className="h-4 w-4" />
          That's <span className="font-bold">${yearly.toLocaleString()}</span> per year - a 38% reduction
        </div>
      </div>
    </motion.div>
  );
}
