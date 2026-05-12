import { motion } from "framer-motion";
import { ArrowRight, ExternalLink } from "lucide-react";
import type { ToolRecommendation } from "@/hooks/useResultsPage";

type ToolRecommendationsSectionProps = {
  tools: ToolRecommendation[];
};

export function ToolRecommendationsSection({ tools }: ToolRecommendationsSectionProps) {
  const badgeFor = (t: ToolRecommendation) => {
    const rt = t.recommendationType ?? "keep_plan";
    const styles: Record<string, string> = {
      downgrade_plan: "border-cyan/40 bg-cyan/10 text-cyan",
      reduce_seats: "border-amber-500/40 bg-amber-500/10 text-amber-200",
      keep_plan: "border-white/15 bg-white/5 text-muted-foreground",
      insufficient_data: "border-destructive/40 bg-destructive/10 text-destructive",
    };
    const labels: Record<string, string> = {
      downgrade_plan: "Downgrade",
      reduce_seats: "Reduce seats",
      keep_plan: "Keep plan",
      insufficient_data: "Needs data",
    };
    return { label: labels[rt] ?? rt, className: styles[rt] ?? styles.keep_plan };
  };

  return (
    <div className="mt-12">
      <h2 className="text-2xl md:text-3xl font-bold">Tool-by-tool recommendations</h2>
      <div className="mt-6 grid gap-3">
        {tools.map((tool, i) => {
          const sevColor = tool.severity === "high" ? "text-success" : tool.severity === "medium" ? "text-cyan" : "text-muted-foreground";
          const logoUrl = `https://www.google.com/s2/favicons?domain=${
            tool.toolName.toLowerCase().includes("cursor") ? "cursor.com" :
            tool.toolName.toLowerCase().includes("chatgpt") || tool.toolName.toLowerCase().includes("openai") ? "openai.com" :
            tool.toolName.toLowerCase().includes("claude") || tool.toolName.toLowerCase().includes("anthropic") ? "anthropic.com" :
            tool.toolName.toLowerCase().includes("github") || tool.toolName.toLowerCase().includes("copilot") ? "github.com" :
            tool.toolName.toLowerCase().includes("gemini") ? "gemini.google.com" :
            tool.toolName.toLowerCase().includes("windsurf") || tool.toolName.toLowerCase().includes("codeium") ? "codeium.com" : "openai.com"
          }&sz=128`;
          
          return (
            <motion.div
              key={tool.toolName}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-strong rounded-2xl p-5 md:p-6 grid md:grid-cols-[1fr_auto_auto_auto] gap-4 items-center hover:bg-white/[0.07] transition"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="h-10 w-10 rounded-lg p-2 grid place-items-center bg-white/10 shrink-0">
                  <img src={logoUrl} alt="" className="w-full h-full object-contain" />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold truncate">{tool.toolName}</span>
                    {(() => {
                      const b = badgeFor(tool);
                      return (
                        <span
                          className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${b.className}`}
                        >
                          {b.label}
                        </span>
                      );
                    })()}
                  </div>
                  <div className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{tool.reason}</div>
                </div>
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
