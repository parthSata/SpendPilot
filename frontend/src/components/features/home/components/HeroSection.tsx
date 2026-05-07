import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { FloatingTool } from "@/hooks/useLandingPage";

type HeroSectionProps = {
  tools: FloatingTool[];
  toolPositions: string[];
};

export function HeroSection({ tools, toolPositions }: HeroSectionProps) {
  return (
    <section className="relative pt-36 pb-24 px-6">
      <div className="mx-auto max-w-6xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs font-medium"
        >
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
          New · GPT-5 & Claude 4.5 pricing supported
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-6 text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]"
        >
          Stop overpaying
          <br />
          for <span className="gradient-text">AI tools</span>.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
        >
          SpendPilot audits every AI subscription and API across your team in
          under 2 minutes — and shows you exactly where to cut without losing
          velocity.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Button asChild variant="hero" size="xl">
            <Link to="/audit">
              Start Free Audit <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="glass" size="xl">
            <Link to="/results">See sample report</Link>
          </Button>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-10 flex flex-wrap justify-center gap-6 text-xs text-muted-foreground"
        >
          <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> Free forever</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> No credit card</span>
          <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-success" /> SOC 2 ready</span>
        </motion.div>

        <div className="pointer-events-none absolute inset-0 hidden md:block">
          {tools.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + i * 0.08, duration: 0.6 }}
              className={`absolute ${toolPositions[i]}`}
              style={{ animationDelay: `${i * 0.4}s` }}
            >
              <div className="h-12 w-12 rounded-xl glass-strong grid place-items-center text-xs font-semibold shadow-card">
                <span style={{ color: t.color === "#FFFFFF" || t.color === "#000000" ? undefined : t.color }}>
                  {t.initial}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
