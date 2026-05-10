import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
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
          const sevColor = tool.severity === "high" ? "text-success" : tool.severity === "medium" ? "text-cyan" : "text-muted-foreground";
          return (
            <motion.div
              key={tool.toolName}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-strong rounded-2xl p-5 md:p-6 grid md:grid-cols-[1fr_auto_auto_auto] gap-4 items-center hover:bg-white/[0.07] transition"
            >
              <div>
                <div className="font-semibold">{tool.toolName}</div>
                <div className="text-sm text-muted-foreground mt-0.5">{tool.reason}</div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <span className="text-muted-foreground line-through">${tool.monthlySpend}</span>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-semibold">{tool.recommendedPlan}</span>
              </div>
              <div className={`text-right font-bold ${sevColor}`}>
                {tool.monthlySavings > 0 ? <>-${tool.monthlySavings}/mo</> : <span className="text-xs uppercase tracking-wider">Keep</span>}
              </div>
              {tool.sourceUrl ? (
                <a
                  href={tool.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-cyan hover:text-cyan/80 transition"
                  title={`Pricing source: ${tool.source}`}
                >
                  <span>{tool.source}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : (
                <span className="text-xs text-muted-foreground">{tool.source || "Pricing Data"}</span>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
