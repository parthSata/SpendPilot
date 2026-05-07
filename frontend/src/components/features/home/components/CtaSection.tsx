import { Link } from "@tanstack/react-router";
import { Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl relative">
        <div className="absolute -inset-6 bg-linear-to-r from-(--electric)/40 via-(--violet)/40 to-(--cyan)/40 blur-3xl rounded-3xl" />
        <div className="relative glass-strong rounded-3xl p-12 md:p-16 text-center gradient-border">
          <Sparkles className="h-8 w-8 mx-auto text-cyan" />
          <h2 className="mt-4 text-4xl md:text-5xl font-bold tracking-tight">
            Find your AI savings <span className="gradient-text">in 2 minutes</span>
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            Free audit. No signup required to see your results.
          </p>
          <div className="mt-8 flex justify-center">
            <Button asChild variant="hero" size="xl">
              <Link to="/audit">
                Start Free Audit <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
