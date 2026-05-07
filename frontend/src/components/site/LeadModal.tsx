import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { X, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LeadModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ email: "", company: "", role: "founder" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2200);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 grid place-items-center p-4 bg-black/60 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md glass-strong rounded-3xl p-8 gradient-border"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 h-8 w-8 grid place-items-center rounded-lg hover:bg-white/10 transition"
            >
              <X className="h-4 w-4" />
            </button>

            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-[var(--success)] to-[var(--cyan)] grid place-items-center">
                  <Check className="h-8 w-8 text-white" />
                </div>
                <h3 className="mt-6 text-2xl font-bold">You're all set</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  We'll reach out within 24 hours to schedule your call.
                </p>
              </motion.div>
            ) : (
              <>
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                  <Sparkles className="h-3.5 w-3.5 text-[var(--cyan)]" /> Free consultation
                </div>
                <h3 className="mt-3 text-2xl font-bold">Book your AI spend review</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  30-minute call. We'll help you lock in your savings.
                </p>

                <form onSubmit={submit} className="mt-6 space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email">Work email</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@company.com"
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      required
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="Acme Inc."
                      className="bg-white/5 border-white/10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Your role</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {["founder", "engineering", "ops", "other"].map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setForm({ ...form, role: r })}
                          className={`py-2 rounded-lg text-sm capitalize transition ${
                            form.role === r
                              ? "bg-gradient-to-br from-[var(--electric)]/30 to-[var(--violet)]/30 border border-[var(--electric)]/50"
                              : "bg-white/5 border border-white/10 hover:bg-white/10"
                          }`}
                        >
                          {r}
                        </button>
                      ))}
                    </div>
                  </div>
                  <Button type="submit" variant="hero" className="w-full" size="lg">
                    Get my consultation
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    No spam. We'll never share your email.
                  </p>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
