export type AITool = {
  id: string;
  name: string;
  category: string;
  defaultPrice: number;
  color: string;
  initial: string;
};

export const AI_TOOLS: AITool[] = [
  { id: "chatgpt", name: "ChatGPT Plus", category: "Chat", defaultPrice: 20, color: "#10A37F", initial: "G" },
  { id: "claude", name: "Claude Pro", category: "Chat", defaultPrice: 20, color: "#D97757", initial: "C" },
  { id: "cursor", name: "Cursor Pro", category: "Coding", defaultPrice: 20, color: "#6E6EF3", initial: "Cu" },
  { id: "copilot", name: "GitHub Copilot", category: "Coding", defaultPrice: 19, color: "#24292F", initial: "Co" },
  { id: "gemini", name: "Gemini Advanced", category: "Chat", defaultPrice: 20, color: "#4285F4", initial: "Ge" },
  { id: "openai-api", name: "OpenAI API", category: "API", defaultPrice: 200, color: "#412991", initial: "O" },
  { id: "anthropic-api", name: "Anthropic API", category: "API", defaultPrice: 150, color: "#CC785C", initial: "A" },
  { id: "perplexity", name: "Perplexity Pro", category: "Search", defaultPrice: 20, color: "#1FB8CD", initial: "P" },
  { id: "midjourney", name: "Midjourney", category: "Image", defaultPrice: 30, color: "#000000", initial: "M" },
  { id: "v0", name: "v0 by Vercel", category: "Coding", defaultPrice: 20, color: "#FFFFFF", initial: "V" },
  { id: "replit", name: "Replit Core", category: "Coding", defaultPrice: 25, color: "#F26207", initial: "R" },
  { id: "notion-ai", name: "Notion AI", category: "Productivity", defaultPrice: 10, color: "#000000", initial: "N" },
];
