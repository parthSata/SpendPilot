import { motion } from "framer-motion";
import { TrendingDown } from "lucide-react";

export function DashboardPreviewSection() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="relative"
        >
          <div className="absolute -inset-4 bg-linear-to-r from-(--electric)/30 via-(--violet)/30 to-(--cyan)/30 blur-3xl rounded-3xl" />
          <div className="relative glass-strong rounded-3xl overflow-hidden gradient-border">
            <div className="px-6 py-3 border-b border-white/5 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/70" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
                <div className="h-3 w-3 rounded-full bg-green-500/70" />
              </div>
              <div className="ml-4 text-xs text-muted-foreground font-mono">spendpilot.app/dashboard</div>
            </div>
            <div className="p-6 md:p-10 grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">Monthly AI spend</div>
                  <div className="mt-2 flex items-end gap-3">
                    <div className="text-5xl font-bold">$4,820</div>
                    <div className="text-sm text-success flex items-center gap-1 mb-2">
                      <TrendingDown className="h-4 w-4" /> -38% potential
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-7 gap-2 h-32 items-end">
                  {[40, 65, 50, 80, 55, 90, 70].map((h, i) => (
                    <motion.div
                      key={i}
                      initial={{ height: 0 }}
                      whileInView={{ height: `${h}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.08, duration: 0.7 }}
                      className="rounded-t-md bg-linear-to-t from-electric to-violet opacity-90"
                    />
                  ))}
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { name: "Cursor Pro", saving: 240, color: "#6E6EF3" },
                  { name: "OpenAI API", saving: 820, color: "#412991" },
                  { name: "ChatGPT Team", saving: 180, color: "#10A37F" },
                ].map((r, i) => (
                  <motion.div
                    key={r.name}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="glass rounded-xl p-3 flex items-center gap-3"
                  >
                    <div className="h-8 w-8 rounded-lg" style={{ background: r.color }} />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{r.name}</div>
                      <div className="text-xs text-success">Save ${r.saving}/mo</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
