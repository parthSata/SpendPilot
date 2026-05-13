import { useCallback, useState } from "react";

const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";

/** Fast, cheap Groq-hosted model; override with VITE_GROQ_MODEL — see https://console.groq.com/docs/models */
const DEFAULT_GROQ_MODEL = "llama-3.1-8b-instant";

type GroqChatResponse = {
  choices?: Array<{ message?: { content?: string } }>;
  error?: { message?: string };
};

export type SummaryRecommendationInput = {
  toolKey: string;
  toolName?: string;
  currentPlan: string;
  suggestedPlan: string;
  monthlySavings: number;
  recommendationType?: string;
};

function displayToolName(r: SummaryRecommendationInput) {
  return r.toolName ?? r.toolKey;
}

export default function useAISummary() {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  const generateSummary = useCallback(
    async ({
      totalSpend,
      totalSavings,
      recommendations,
    }: {
      totalSpend: number;
      totalSavings: number;
      recommendations: SummaryRecommendationInput[];
    }) => {
      setIsLoading(true);
      setError(null);
      setSummary(null);
      setIsFallback(false);

      const applyFallback = () => {
        if (totalSavings === 0) {
          setSummary(
            `Your AI tool stack costs $${totalSpend}/month. Plan and seat selections look efficient with no large automated downgrades — continue validating usage as you scale.`
          );
        } else {
          const sorted = [...recommendations]
            .filter((r) => r.monthlySavings > 0)
            .sort((a, b) => b.monthlySavings - a.monthlySavings);
          const topRec = sorted[0];
          const percent = totalSpend > 0 ? Math.round((totalSavings / totalSpend) * 100) : 0;

          let topRecSentence = "";
          if (topRec) {
            const nm = displayToolName(topRec);
            const samePlan =
              String(topRec.suggestedPlan).toLowerCase() === String(topRec.currentPlan).toLowerCase();

            if (topRec.recommendationType === "reduce_seats" && topRec.monthlySavings > 0) {
              topRecSentence = `Biggest win: reclaim spend on ${nm} by tightening seats while keeping ${topRec.currentPlan} (~$${topRec.monthlySavings}/mo).`;
            } else if (topRec.recommendationType === "keep_plan" || samePlan) {
              topRecSentence = `${nm} is best kept on ${topRec.currentPlan} at your usage level; savings come from other levers in the table below.`;
            } else {
              topRecSentence = `Largest near-term lever: align ${nm} from ${topRec.currentPlan} toward ${topRec.suggestedPlan} (~$${topRec.monthlySavings}/mo if usage supports it).`;
            }
          }

          setSummary(
            `Your team spends about $${totalSpend}/month on AI tools. The audit flags roughly $${totalSavings}/month in optimizations (${percent}% of spend). ${topRecSentence} Annualized, that is on the order of $${totalSavings * 12}.`
          );
        }
        setIsFallback(true);
      };

      try {
        const apiKey = import.meta.env.VITE_GROQ_API_KEY as string | undefined;
        if (!apiKey?.trim()) {
          throw new Error("Missing VITE_GROQ_API_KEY");
        }

        const recsText =
          recommendations
            .map(
              (r) =>
                `${displayToolName(r)}: ${r.currentPlan} → ${r.suggestedPlan} (${r.recommendationType ?? "n/a"}), save $${r.monthlySavings}/mo`
            )
            .join("; ") || "None";

        const userPrompt = `You are an AI infrastructure cost consultant.
Write a professional audit summary in exactly 3 short paragraphs (~100 words total).

Data:
- Current monthly AI tool spend: $${totalSpend}
- Potential monthly savings identified: $${totalSavings}
- Per-tool signals (plan labels must match this list; do not contradict a "keep" with a "downgrade" for the same tool): ${recsText}

Paragraph 1: Summarize current spend.
Paragraph 2: Describe the optimization opportunities (respect keep_plan vs downgrade_plan).
Paragraph 3: Expected outcome if changes are made.

Rules: Prose only. No bullet points. No headers. Professional tone. Under 120 words total.`;

        const model =
          (import.meta.env.VITE_GROQ_MODEL as string | undefined)?.trim() || DEFAULT_GROQ_MODEL;

        const res = await fetch(GROQ_CHAT_URL, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey.trim()}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model,
            messages: [{ role: "user", content: userPrompt }],
            temperature: 0.4,
            max_tokens: 600,
          }),
        });

        const data = (await res.json()) as GroqChatResponse;

        if (!res.ok) {
          const apiMsg = data.error?.message || res.statusText || `HTTP ${res.status}`;
          throw new Error(apiMsg);
        }

        const text = data.choices?.[0]?.message?.content?.trim();
        if (!text) {
          throw new Error("Empty response from Groq");
        }

        setSummary(text);
        setIsFallback(false);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        const is429 = msg.includes("429") || msg.toLowerCase().includes("rate limit");
        const is404 = msg.includes("404") || msg.toLowerCase().includes("not found");
        const isModel =
          msg.toLowerCase().includes("model") &&
          (msg.toLowerCase().includes("does not exist") || msg.toLowerCase().includes("invalid"));

        if (is429) {
          setError("Groq rate limit reached — showing template summary below.");
        } else if (is404 || isModel) {
          setError(
            `Groq model issue (${(import.meta.env.VITE_GROQ_MODEL as string | undefined)?.trim() || DEFAULT_GROQ_MODEL}). Set VITE_GROQ_MODEL in .env to a model your key supports (see Groq docs) and restart Vite.`
          );
        } else {
          setError(msg || "Failed to generate AI summary");
        }

        applyFallback();
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { summary, isLoading, error, isFallback, generateSummary };
}
