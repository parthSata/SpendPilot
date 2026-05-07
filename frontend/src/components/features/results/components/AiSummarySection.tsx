import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function AiSummarySection() {
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
      <p className="mt-4 text-base md:text-lg leading-relaxed">
        Your team is overpaying primarily on <span className="text-foreground font-semibold">OpenAI API calls</span> where
        ~80% of requests don't need GPT-4-class models. Combined with{" "}
        <span className="text-foreground font-semibold">4 inactive Cursor seats</span> and underused ChatGPT Team licenses,
        you can recover <span className="gradient-text font-bold">$1,840/month</span> without affecting velocity.
        Highest-ROI move: route low-stakes calls to gpt-4o-mini.
      </p>
    </motion.div>
  );
}
