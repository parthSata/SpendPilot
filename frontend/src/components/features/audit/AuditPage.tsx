import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";
import { ArrowLeft, ArrowRight, Check, Plus, TrendingDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Navbar } from "@/components/site/Navbar";
import { AuroraBackground } from "@/components/site/Background";
import { AI_TOOLS } from "@/lib/tools";
import { useAuditFlow, type SelectedTools } from "@/hooks/useAuditFlow";

export function AuditPage() {
  const {
    step,
    selected,
    teamSize,
    useCase,
    total,
    estSavings,
    steps,
    useCases,
    setSelected,
    setTeamSize,
    setUseCase,
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
                {step === 2 && <UseCaseStep useCase={useCase} useCases={useCases} setUseCase={setUseCase} />}
                {step === 3 && <ReviewStep selected={selected} teamSize={teamSize} useCase={useCase} />}
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
            <div className="glass-strong rounded-2xl p-6">
              <div className="text-xs uppercase tracking-wider text-muted-foreground">Estimated monthly spend</div>
              <div className="mt-2 text-3xl font-bold">${Math.round(total).toLocaleString()}</div>
              <div className="mt-4 h-px bg-white/10" />
              <div className="mt-4 flex items-center gap-2 text-success">
                <TrendingDown className="h-4 w-4" />
                <div>
                  <div className="text-xs uppercase tracking-wider">Potential savings</div>
                  <div className="text-2xl font-bold">${estSavings.toLocaleString()}/mo</div>
                </div>
              </div>
              <div className="mt-4 text-xs text-muted-foreground">
                That's <span className="text-foreground font-semibold">${(estSavings * 12).toLocaleString()}</span> per year.
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

function ToolsStep({ selected, setSelected }: { selected: SelectedTools; setSelected: (s: SelectedTools) => void }) {
  const toggle = (id: string, price: number) => {
    const copy = { ...selected };
    if (copy[id] !== undefined) {
      delete copy[id];
    } else {
      copy[id] = price;
    }
    setSelected(copy);
  };

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold">Which AI tools is your team using?</h2>
      <p className="mt-2 text-muted-foreground text-sm">Tap to add. You can adjust monthly cost per tool.</p>
      <div className="mt-6 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {AI_TOOLS.map((t) => {
          const active = selected[t.id] !== undefined;
          return (
            <motion.button
              key={t.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => toggle(t.id, t.defaultPrice)}
              className={`relative text-left p-4 rounded-xl border transition ${
                active
                  ? "border-(--electric)/60 bg-(--electric)/10"
                  : "border-white/10 bg-white/5 hover:bg-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className="h-10 w-10 rounded-lg grid place-items-center text-xs font-semibold"
                  style={{
                    background: `${t.color}33`,
                    color: t.color === "#FFFFFF" || t.color === "#000000" ? "#fff" : t.color,
                  }}
                >
                  {t.initial}
                </div>
                <div className="flex-1">
                  <div className="font-medium text-sm">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.category}</div>
                </div>
                <div
                  className={`h-5 w-5 rounded-full border grid place-items-center transition ${
                    active ? "bg-linear-to-br from-electric to-violet border-transparent" : "border-white/20"
                  }`}
                >
                  {active ? <Check className="h-3 w-3 text-white" /> : <Plus className="h-3 w-3 text-muted-foreground" />}
                </div>
              </div>
              {active && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-3 flex items-center gap-2"
                >
                  <span className="text-xs text-muted-foreground">$</span>
                  <Input
                    type="number"
                    value={selected[t.id]}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setSelected({ ...selected, [t.id]: Number(e.target.value) || 0 })}
                    className="h-8 bg-white/5 border-white/10"
                  />
                  <span className="text-xs text-muted-foreground">/mo</span>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function TeamStep({ teamSize, setTeamSize }: { teamSize: number; setTeamSize: (n: number) => void }) {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold">How big is your team?</h2>
      <p className="mt-2 text-muted-foreground text-sm">We'll factor seat-based pricing into your savings.</p>
      <div className="mt-10 glass rounded-2xl p-8">
        <div className="text-center">
          <div className="text-7xl font-bold gradient-text">{teamSize}</div>
          <div className="mt-1 text-sm text-muted-foreground">{teamSize === 1 ? "person" : "people"}</div>
        </div>
        <div className="mt-8">
          <Slider value={[teamSize]} onValueChange={(v) => setTeamSize(v[0])} min={1} max={100} step={1} />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>1</span>
            <span>25</span>
            <span>50</span>
            <span>100+</span>
          </div>
        </div>
        <div className="mt-8 grid grid-cols-4 gap-2">
          {[1, 5, 15, 50].map((n) => (
            <button
              key={n}
              onClick={() => setTeamSize(n)}
              className={`py-2 rounded-lg text-sm font-medium transition ${
                teamSize === n ? "bg-white/10 border border-white/20" : "bg-white/3 border border-white/5 hover:bg-white/5"
              }`}
            >
              {n === 1 ? "Solo" : n}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function UseCaseStep({
  useCase,
  useCases,
  setUseCase,
}: {
  useCase: string;
  useCases: ReadonlyArray<{ id: string; title: string; desc: string }>;
  setUseCase: (v: string) => void;
}) {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold">What's your primary use case?</h2>
      <p className="mt-2 text-muted-foreground text-sm">Helps us tune recommendations to your workflow.</p>
      <div className="mt-6 grid sm:grid-cols-2 gap-3">
        {useCases.map((c) => (
          <motion.button
            key={c.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => setUseCase(c.id)}
            className={`text-left p-5 rounded-xl border transition ${
              useCase === c.id ? "border-(--electric)/60 bg-(--electric)/10" : "border-white/10 bg-white/5 hover:bg-white/10"
            }`}
          >
            <div className="font-semibold">{c.title}</div>
            <div className="mt-1 text-sm text-muted-foreground">{c.desc}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

function ReviewStep({
  selected,
  teamSize,
  useCase,
}: {
  selected: SelectedTools;
  teamSize: number;
  useCase: string;
}) {
  const items = useMemo(
    () =>
      Object.entries(selected).map(([id, price]) => {
        const tool = AI_TOOLS.find((t) => t.id === id)!;
        return { ...tool, price };
      }),
    [selected],
  );

  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold">Quick review</h2>
      <p className="mt-2 text-muted-foreground text-sm">Confirm and we'll generate your savings report.</p>
      <div className="mt-6 grid gap-3">
        {items.map((i) => (
          <div key={i.id} className="glass rounded-xl p-4 flex items-center gap-3">
            <div
              className="h-9 w-9 rounded-lg grid place-items-center text-xs font-semibold"
              style={{
                background: `${i.color}33`,
                color: i.color === "#FFFFFF" || i.color === "#000000" ? "#fff" : i.color,
              }}
            >
              {i.initial}
            </div>
            <div className="flex-1 text-sm font-medium">{i.name}</div>
            <div className="text-sm font-mono">${i.price}/mo</div>
          </div>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
        <div className="glass rounded-xl p-4">
          <div className="text-xs text-muted-foreground">Team size</div>
          <div className="mt-1 font-semibold">{teamSize} people</div>
        </div>
        <div className="glass rounded-xl p-4">
          <div className="text-xs text-muted-foreground">Use case</div>
          <div className="mt-1 font-semibold capitalize">{useCase}</div>
        </div>
      </div>
    </div>
  );
}
