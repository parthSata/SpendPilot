import { useCallback, useState } from "react";
import type { Recommendation } from "../lib/pricing/pricing";

const GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";

/** Fast, cheap Groq-hosted model; override with VITE_GROQ_MODEL — see https://console.groq.com/docs/models */
const DEFAULT_GROQ_MODEL = "llama-3.1-8b-instant";

type GroqChatResponse = {
  choices?: Array<{ message?: { content?: string } }>;
  error?: { message?: string };
};

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
      recommendations: Recommendation[];
    }) => {
      setIsLoading(true);
      setError(null);
      setSummary(null);
      setIsFallback(false);

      const applyFallback = () => {
        if (totalSavings === 0) {
          setSummary(
            `Your AI tool stack costs $${totalSpend}/month. Current plan selections are well optimized with no immediate downgrades recommended. Continue monitoring usage patterns as your team scales.`
          );
        } else {
          const topRec = recommendations[0];
          const topRecSentence = topRec
            ? `Downgrading ${topRec.toolKey} to ${topRec.suggestedPlan} is highly recommended.`
            : "";
          const percent = totalSpend > 0 ? Math.round((totalSavings / totalSpend) * 100) : 0;

          setSummary(
            `Your team spends $${totalSpend}/month on AI tools. Analysis identified $${totalSavings}/month in potential savings (${percent}% reduction) by optimizing plan tiers. ${topRecSentence} Implementing these changes would save $${totalSavings * 12} annually.`
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
                `Switch ${r.toolKey} from ${r.currentPlan} to ${r.suggestedPlan}: save $${r.monthlySavings}/mo`
            )
            .join(", ") || "None";

        const userPrompt = `You are an AI infrastructure cost consultant.
Write a professional audit summary in exactly 3 short paragraphs (~100 words total).

Data:
- Current monthly AI tool spend: $${totalSpend}
- Potential monthly savings identified: $${totalSavings}
- Top recommendations: ${recsText}

Paragraph 1: Summarize current spend.
Paragraph 2: Describe the optimization opportunities.
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
