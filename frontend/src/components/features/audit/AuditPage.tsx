import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, Check, TrendingDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/site/Navbar";
import { AuroraBackground } from "@/components/site/Background";
import { useAuditFlow } from "@/hooks/useAuditFlow";
import { formatPrice } from "@/lib/pricing/pricing";

// Separated Step Components
import { ToolsStep } from "./components/ToolsStep";
import { TeamStep } from "./components/TeamStep";
import { UseCaseStep } from "./components/UseCaseStep";
import { ReviewStep } from "./components/ReviewStep";

export function AuditPage() {
  const {
    step,
    selected,
    teamSize,
    useCase,
    usageIntensity,
    total,
    estSavings,
    steps,
    useCases,
    setSelected,
    setTeamSize,
    setUseCase,
    setUsageIntensity,
    next,
    prev,
    isSubmitting,
    submitError,
  } = useAuditFlow();

  return (
    <div className="relative min-h-screen">
      <AuroraBackground />
      <Navbar />
      <div className="pt-32 pb-20 px-4">
        <div className="mx-auto max-w-6xl grid lg:grid-cols-[1fr_360px] gap-8">
          <div className="glass-strong rounded-3xl p-6 md:p-10">
            <div className="flex items-center gap-2 mb-8">
              {steps.map((s, i) => (
                <div key={s} className="flex items-center gap-2 flex-1">
                  <div
                    className={`h-8 w-8 rounded-full grid place-items-center text-xs font-semibold transition ${
                      i <= step
                        ? "bg-linear-to-br from-electric to-violet text-white"
                        : "bg-white/5 text-muted-foreground"
                    }`}
                  >
                    {i < step ? <Check className="h-4 w-4" /> : i + 1}
                  </div>
                  <div className={`text-xs font-medium hidden sm:block ${i <= step ? "" : "text-muted-foreground"}`}>
                    {s}
                  </div>
                  {i < steps.length - 1 && (
                    <div className="flex-1 h-px bg-white/10 relative overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: i < step ? "100%" : "0%" }}
                        className="absolute inset-y-0 left-0 bg-linear-to-r from-electric to-violet"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                {step === 0 && <ToolsStep selected={selected} setSelected={setSelected} />}
                {step === 1 && <TeamStep teamSize={teamSize} setTeamSize={setTeamSize} />}
                {step === 2 && (
                  <UseCaseStep
                    useCase={useCase}
                    useCases={useCases}
                    setUseCase={setUseCase}
                    usageIntensity={usageIntensity}
                    setUsageIntensity={setUsageIntensity}
                  />
                )}
                {step === 3 && (
                  <ReviewStep selected={selected} teamSize={teamSize} useCase={useCase} usageIntensity={usageIntensity} />
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex justify-between">
              <Button variant="ghost" onClick={prev} disabled={step === 0}>
                <ArrowLeft className="h-4 w-4" /> Back
              </Button>
              <Button variant="hero" onClick={() => void next()} size="lg" disabled={isSubmitting}>
                {step === 3 ? (isSubmitting ? "Generating report..." : "See my savings") : "Continue"}{" "}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            {submitError ? <p className="mt-3 text-sm text-destructive">{submitError}</p> : null}
          </div>

          <div className="lg:sticky lg:top-28 self-start space-y-4">
            <div className="glass-strong rounded-2xl p-6 overflow-hidden">
              <div className="text-xs uppercase tracking-wider text-muted-foreground truncate">Estimated monthly spend</div>
              <div className="mt-2 text-3xl font-bold truncate">{formatPrice(Math.round(total))}</div>
              <div className="mt-4 h-px bg-white/10" />
              <div className="mt-4 flex items-center gap-2 text-success min-w-0">
                <TrendingDown className="h-4 w-4 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs uppercase tracking-wider truncate">Potential savings</div>
                  <div className="text-2xl font-bold truncate">{formatPrice(estSavings)}/mo</div>
                </div>
              </div>
              <div className="mt-4 text-xs text-muted-foreground truncate">
                That's <span className="text-foreground font-semibold">{formatPrice(estSavings * 12)}</span> per year.
              </div>
            </div>

            <div className="glass rounded-2xl p-5 text-xs text-muted-foreground">
              <Sparkles className="h-4 w-4 text-cyan mb-2" />
              We never connect to billing. Your inputs stay private and are only used to generate your report.
            </div>
            <Link to="/" className="block text-xs text-muted-foreground hover:text-foreground transition text-center">
              ← Back to homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
