import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { ToolRecommendation } from "@/hooks/useResultsPage";

type ToolRecommendationsSectionProps = {
  tools: ToolRecommendation[];
};

export function ToolRecommendationsSection({ tools }: ToolRecommendationsSectionProps) {
  return (
    <div className="mt-12">
      <h2 className="text-2xl md:text-3xl font-bold">Tool-by-tool recommendations</h2>
      <div className="mt-6 grid gap-3">
        {tools.map((tool, i) => {
          const saving = tool.current - tool.recommended;
          const sevColor = tool.severity === "high" ? "text-success" : tool.severity === "medium" ? "text-cyan" : "text-muted-foreground";
          return (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-strong rounded-2xl p-5 md:p-6 grid md:grid-cols-[1fr_auto_auto] gap-4 items-center hover:bg-white/[0.07] transition"
            >
              <div>
                <div className="font-semibold">{tool.name}</div>
                <div className="text-sm text-muted-foreground mt-0.5">{tool.action}</div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-muted-foreground line-through">${tool.current}</span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-semibold">${tool.recommended}</span>
              </div>
              <div className={`text-right font-bold ${sevColor}`}>
                {saving > 0 ? <>-${saving}/mo</> : <span className="text-xs uppercase tracking-wider">Keep</span>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
