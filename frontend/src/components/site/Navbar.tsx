import { Link } from "@tanstack/react-router";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { Sparkles, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 20));

  const links = [
    { to: "/", label: "Home" },
    { to: "/audit", label: "Audit" },
    { to: "/results", label: "Results" },
  ];

  return (
    <motion.header
      initial={{ y: -30, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "py-2" : "py-4"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4">
        <div
          className={`flex items-center justify-between rounded-2xl px-4 md:px-6 py-3 transition-all duration-300 border border-white/10 ${
            scrolled
              ? "bg-background/50 backdrop-blur-3xl shadow-[0_12px_48px_rgba(0,0,0,0.4)] border-white/15"
              : "bg-background/35 backdrop-blur-2xl border-white/10"
          }`}
        >
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <div className="absolute inset-0 rounded-lg bg-linear-to-br from-electric to-violet blur-md opacity-70 group-hover:opacity-100 transition" />
              <div className="relative h-8 w-8 rounded-lg bg-linear-to-br from-electric to-violet grid place-items-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
            </div>
            <span className="font-display text-lg font-semibold tracking-tight">
              Spend<span className="gradient-text">Pilot</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition rounded-md hover:bg-white/5"
                activeProps={{ className: "px-3 py-1.5 text-sm text-foreground rounded-md bg-white/5" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <Button asChild variant="hero" size="sm">
              <Link to="/audit">Start Free Audit</Link>
            </Button>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 rounded-lg hover:bg-white/5"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden mt-2 glass-strong rounded-2xl p-4 flex flex-col gap-2 bg-background/95 backdrop-blur-xl border border-white/10 shadow-2xl"
          >
            {links.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className="px-3 py-2 text-sm rounded-md hover:bg-white/5"
              >
                {l.label}
              </Link>
            ))}
            <Button asChild variant="hero" size="sm" className="mt-2">
              <Link to="/audit">Start Free Audit</Link>
            </Button>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
