import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Recommendation } from "../lib/pricing/pricing";

export default function useAISummary() {
  const [summary, setSummary] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFallback, setIsFallback] = useState(false);

  const generateSummary = async ({
    totalSpend,
    totalSavings,
    recommendations
  }: {
    totalSpend: number;
    totalSavings: number;
    recommendations: Recommendation[];
  }) => {
    setIsLoading(true);
    setError(null);
    setSummary(null);
    setIsFallback(false);

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error("Missing VITE_GEMINI_API_KEY");
      }

      const recsText = recommendations.map(r => 
        `Switch ${r.toolKey} from ${r.currentPlan} to ${r.suggestedPlan}: save $${r.monthlySavings}/mo`
      ).join(", ") || "None";

      const prompt = `You are an AI infrastructure cost consultant.
Write a professional audit summary in exactly 3 short paragraphs (~100 words total).

Data:
- Current monthly AI tool spend: $${totalSpend}
- Potential monthly savings identified: $${totalSavings}
- Top recommendations: ${recsText}

Paragraph 1: Summarize current spend.
Paragraph 2: Describe the optimization opportunities.
Paragraph 3: Expected outcome if changes are made.

Rules: Prose only. No bullet points. No headers. Professional tone. Under 120 words total.`;

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      
      setSummary(response.text().trim());
      setIsFallback(false);
    } catch (err: any) {
      setError(err.message || "Failed to generate AI summary");
      
      if (totalSavings === 0) {
        setSummary(`Your AI tool stack costs $${totalSpend}/month. Current plan selections are well optimized with no immediate downgrades recommended. Continue monitoring usage patterns as your team scales.`);
      } else {
        const topRec = recommendations[0];
        const topRecSentence = topRec 
          ? `Downgrading ${topRec.toolKey} to ${topRec.suggestedPlan} is highly recommended.` 
          : "";
        const percent = totalSpend > 0 ? Math.round((totalSavings / totalSpend) * 100) : 0;
        
        setSummary(`Your team spends $${totalSpend}/month on AI tools. Analysis identified $${totalSavings}/month in potential savings (${percent}% reduction) by optimizing plan tiers. ${topRecSentence} Implementing these changes would save $${totalSavings * 12} annually.`);
      }
      setIsFallback(true);
    } finally {
      setIsLoading(false);
    }
  };

  return { summary, isLoading, error, isFallback, generateSummary };
}
