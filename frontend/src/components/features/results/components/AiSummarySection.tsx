import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

type AiSummarySectionProps = {
  summary: string;
};

export function AiSummarySection({ summary }: AiSummarySectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mt-8 glass-strong rounded-2xl p-6 md:p-8 gradient-border"
    >
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        <Sparkles className="h-3.5 w-3.5 text-violet" /> AI-generated summary
      </div>
      <p className="mt-4 text-base md:text-lg leading-relaxed">{summary}</p>
    </motion.div>
  );
}
